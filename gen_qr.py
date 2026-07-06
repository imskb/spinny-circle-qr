# /// script
# requires-python = ">=3.10"
# dependencies = ["qrcode[pil]==7.4.2"]
# ///
"""Generate a static QR PNG for the Spinny Circle smart link.

Usage:
    uv run gen_qr.py "https://your-deployed-url.pages.dev"
    uv run gen_qr.py "https://your-deployed-url.pages.dev" spinny-circle-qr.png
"""
import sys
import qrcode
from qrcode.constants import ERROR_CORRECT_M


def main() -> None:
    if len(sys.argv) < 2:
        print('Usage: uv run gen_qr.py "<URL>" [output.png]')
        sys.exit(1)

    url = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "spinny-circle-qr.png"

    qr = qrcode.QRCode(
        version=None,               # auto-size to fit the URL
        error_correction=ERROR_CORRECT_M,  # ~15% damage tolerance — good for print
        box_size=20,                # large & crisp for posters/standees
        border=4,                   # standard quiet zone
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(out)
    print(f"Wrote {out}  ->  {url}")


if __name__ == "__main__":
    main()
