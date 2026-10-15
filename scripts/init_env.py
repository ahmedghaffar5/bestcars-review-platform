"""Create local configuration without printing secrets or replacing an existing file."""

from pathlib import Path
import os
import secrets


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    target = root / '.env'
    if target.exists():
        print('.env already exists; preserved unchanged. Review it privately.')
        return 0
    template = (root / '.env.example').read_text(encoding='utf-8')
    marker = 'DJANGO_SECRET_KEY=\n'
    if marker not in template:
        raise SystemExit('Expected an empty DJANGO_SECRET_KEY in .env.example.')
    content = template.replace(marker, f'DJANGO_SECRET_KEY={secrets.token_urlsafe(48)}\n', 1)
    fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(content)
    print('Created private .env with a generated key. Do not commit it.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
