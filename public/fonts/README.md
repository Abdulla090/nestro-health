# Kurdish Font Installation

## Kurdish Fonts

### Current Fonts:

1. **NizarBukra** (Primary Kurdish Font)
   - `NizarBukraRegular.ttf` - Regular weight
   - `NizarBukraBold.woff2` - Bold weight

2. **UJICode** (Fallback Kurdish Font)
   - `UJICode-Regular.woff2` and `UJICode-Regular.woff`
   - `UJICode-Bold.woff2` and `UJICode-Bold.woff`

### Important:

- The `NizarBukraRegular.ttf` file is currently a placeholder. **You need to replace it with the actual font file** for the Kurdish interface to display correctly.
- Make sure the font filename is exactly `NizarBukraRegular.ttf` to match the references in the CSS.
- The Kurdish interface will use NizarBukra as the primary font with UJICode as fallback.

### How to add the font:

1. Obtain the NizarBukraRegular.ttf font file
2. Replace the placeholder file in this directory with the actual font file
3. Restart the application

### Font Licensing:

Make sure you have the appropriate licenses for all fonts used in production.

## Where to Get UJICode Fonts

UJICode is a popular font for Kurdish Sorani. You can obtain these fonts from:

1. [Kurdish Central](https://kurdishcentral.org/downloads/fonts/) - A repository of Kurdish fonts
2. [Kurditgroup](https://kurditgroup.org/download) - Kurdish IT resources
3. [Wêjegeh](https://vejin.net/fonts/) - Kurdish language resources

## Converting Other Font Formats

If you find the UJICode fonts in other formats (like TTF), you can convert them to WOFF/WOFF2 using online converters such as:
- [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
- [Transfonter](https://transfonter.org/)

## Alternative Kurdish Fonts

If you cannot obtain UJICode, other good options for Kurdish Sorani include:
- Ali_K_Sorani
- Sorani
- Rudaw
- NotoSansArabicKurdish
- Rabar

Simply download these fonts in WOFF/WOFF2 format and update the font-family in the CSS accordingly. 