"""Read-only HTTP checks for the HTML shell, React assets, and optional live APIs."""

import argparse
from html.parser import HTMLParser
import json
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen


class AssetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.styles = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('src'):
            self.scripts.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet' and attrs.get('href'):
            self.styles.append(attrs['href'])


def get(base: str, path: str, timeout: int = 15):
    url = urljoin(base.rstrip('/') + '/', path)
    if urlsplit(url).netloc != urlsplit(base).netloc:
        raise RuntimeError('Refusing to follow an asset on a different host: ' + url)
    with urlopen(url, timeout=timeout) as response:
        if response.status != 200:
            raise RuntimeError(f'{path}: HTTP {response.status}')
        return response.headers.get_content_type(), response.read()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', default='http://localhost:8000')
    parser.add_argument('--integration', action='store_true')
    parser.add_argument('--wait', type=int, default=60, help='Maximum initial startup wait in seconds')
    args = parser.parse_args()
    base = args.base.rstrip('/')
    if urlsplit(base).scheme not in {'http', 'https'} or not urlsplit(base).netloc:
        parser.error('--base must be an HTTP or HTTPS origin')
    deadline = time.monotonic() + max(0, args.wait)
    while True:
        try:
            get(base, '/', timeout=2)
            break
        except (OSError, URLError, HTTPError, RuntimeError):
            if time.monotonic() >= deadline:
                raise RuntimeError('Application did not become available before the startup deadline')
            time.sleep(1)

    for path in ['/', '/about/', '/contact/', '/login/', '/dealers/']:
        content_type, body = get(base, path)
        if content_type != 'text/html' or not body:
            raise RuntimeError(path + ': expected nonempty HTML')
        print('PASS HTML', path)

    _, html = get(base, '/login/')
    assets = AssetParser()
    assets.feed(html.decode('utf-8'))
    scripts = [p for p in assets.scripts if p.startswith('/static/')]
    styles = [p for p in assets.styles if p.startswith('/static/')]
    if not scripts or not styles:
        raise RuntimeError('The React HTML is missing its built JavaScript or stylesheet links')
    for path in scripts + styles:
        content_type, body = get(base, path)
        allowed = {'application/javascript', 'text/javascript', 'application/x-javascript'}
        if path in styles:
            allowed = {'text/css'}
        if content_type not in allowed or not body:
            raise RuntimeError(f'{path}: invalid asset content type {content_type!r}')
        print('PASS ASSET', path)

    if args.integration:
        checks = [
            ('/djangoapp/get_dealers', 'dealers'),
            ('/djangoapp/get_dealers/Kansas', 'dealers'),
            ('/djangoapp/dealer/29', 'dealer'),
            ('/djangoapp/get_cars', 'CarModels'),
            ('/djangoapp/reviews/dealer/29', 'reviews'),
        ]
        for path, key in checks:
            content_type, body = get(base, path, timeout=30)
            if content_type != 'application/json':
                raise RuntimeError(path + ': expected JSON')
            data = json.loads(body)
            if not isinstance(data.get(key), list) or not data[key]:
                raise RuntimeError(path + ': expected a nonempty ' + key + ' list')
            print('PASS API', path, 'records:', len(data[key]))
        print('Live API checks do not replace register/login/review-write browser tests.')
    print('Requested smoke checks passed.')
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (OSError, ValueError, RuntimeError) as error:
        print('FAIL:', error)
        raise SystemExit(1)
