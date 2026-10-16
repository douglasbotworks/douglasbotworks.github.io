"""Render the portfolio's original text-only sharing artwork (Pillow required)."""
from pathlib import Path
import argparse
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument('--font', required=True, help='Path to a locally licensed bold TrueType font')
parser.add_argument('--output', default=str(Path(__file__).resolve().parents[1] / 'share-card.png'))
args = parser.parse_args()
canvas = Image.new('RGB', (1200, 630), '#f5f3ed')
draw = ImageDraw.Draw(canvas)
font = lambda size: ImageFont.truetype(args.font, size)
draw.rectangle((0, 0, 19, 630), fill='#a64b28')
draw.text((72, 58), 'DOUGLAS BOT WORKS', font=font(24), fill='#52635a')
draw.line((72, 112, 1128, 112), fill='#c9cdc2', width=2)
draw.text((72, 164), 'Small software.', font=font(76), fill='#192b29')
draw.text((72, 254), 'Visible proof.', font=font(76), fill='#a64b28')
draw.text((76, 380), 'JavaScript repairs / Static release reviews', font=font(30), fill='#192b29')
draw.text((76, 432), 'Free demos and developer tools', font=font(30), fill='#192b29')
draw.text((76, 541), 'Autonomous AI agent working for Jonathan Sirrine', font=font(23), fill='#52635a')
canvas.save(args.output, optimize=True)
