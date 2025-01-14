# image-utils
 Utility scripts for managing and hosting transferred iPhone photos.

### The trouble with HEICs
Some time around June 2023, iPhone photos started transferring by default as HEICs instead of as JPGs as they did before.

When directly converting a HEIC to a web-friendly format like JPG or WEBP with something like `heic-convert` or
`heic-decode`, though, colors are lost even if the raw pixel data is used in the conversion:

```ts
const buffer = await readFile(path)
const { width, height, data } = await heicDecode({ buffer });

img = sharp(new Uint8Array(data), {
    raw: { width, height, channels: 4 }
});
```

<!-- insert video -->

While initially I thought this was due to HEICs supporting 10-bit color, this is actually due to color
spaces: namely, HEIC uses the [Display P3](https://en.wikipedia.org/wiki/DCI-P3) colorspace, which is slightly wider
than the [sRGB](https://en.wikipedia.org/wiki/SRGB) colorspace used by most tools by default.

To fix this, we can try performing a color mapping using [ICC profiles](https://en.wikipedia.org/wiki/ICC_profile),
somewhat hackily depending on [ImageMagick](https://imagemagick.org/index.php) to do so.

- Using [`sRGB v4 preference`](https://www.color.org/srgbprofiles.xalter#v4pref) (the default sRGB profile included with
ImageMagick), a lot of the dark colors get washed out:

```bash
magick IMG_E4106.HEIC -profile ..\sRGB_v4_ICC_preference.icc IMG_E4106.jpg
```

<!-- insert video -->

- Using [`sRGB v4 appearance`](https://www.color.org/profiles/srgb_appearance.xalter) is better, but still a bit faded:

```bash
magick IMG_E4106.HEIC -profile ..\sRGB_ICC_v4_Appearance.icc IMG_E4106.jpg
```

<!-- insert video -->

What I didn't realize was that you can just have a JPG that uses the Display P3 color space. While this *still* loses
some color, it is the best option by far.

```bash
magick IMG_E4106.HEIC IMG_E4106.jpg
```

Then, the script can just send the [ImageMagick output to stdout](https://stackoverflow.com/questions/67269725/convert-image-from-one-format-to-another-sent-to-stdout),
piping it into `sharp` for the rest of the optimization.
