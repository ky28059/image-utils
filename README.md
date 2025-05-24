# image-utils
 Utility scripts for managing and hosting transferred iPhone photos.

Run
```bash
npm run info
```
to display parsed information about the photo directory structure,
```bash
npm run all
```
to process and optimize all photos, and
```bash
npm start
```
to start the photo server.

### About this project
The main idea with this project was to create an image server capable of hosting the many photos I've taken over the
years. I transfer most of my photos to my computer, where they are sorted by date / event in the following structure:
```
Photos
|___ 2024-08-12 Santa Cruz
|    |___ IMG_...
|    |___ IMG_...
|
|___ 2025-05-11 ...
     |___ ...
```
I wanted to be able to send shareable links for certain folders to people, but OneDrive was a little inconvenient to use
and not primarily designed for photo sharing (plus, I wanted custom behavior for edited photos).

To process these photos for the web,

1. Each photo needs to be converted to a web-renderable file format (see next section).
2. Each photo needs to be optimized for size with minimal loss of quality (~2 MB → ~400 KB).
3. "Duplicated" photos need to be coalesced (e.g. if a folder contains both an edited and non-edited version of a photo,
keep only the edited version) and non-photo files (any stray `.AAE`s) need to be ignored.

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

https://github.com/user-attachments/assets/8077a720-78a3-4b1f-9ee8-cd7c9b670cf9

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

https://github.com/user-attachments/assets/3202e94b-ad97-4491-bd34-0eb7844e2962

- Using [`sRGB v4 appearance`](https://www.color.org/profiles/srgb_appearance.xalter) is better, but still a bit faded:

```bash
magick IMG_E4106.HEIC -profile ..\sRGB_ICC_v4_Appearance.icc IMG_E4106.jpg
```

https://github.com/user-attachments/assets/90e5595d-d56b-4cbc-b92f-159c07f12896

What I didn't realize was that you can just have a JPG that uses the Display P3 color space. While this *still* loses
some color, it is the best option by far.

```bash
magick IMG_E4106.HEIC IMG_E4106.jpg
```

Then, the script can just send the [ImageMagick output to stdout](https://stackoverflow.com/questions/67269725/convert-image-from-one-format-to-another-sent-to-stdout),
piping it into `sharp` for the rest of the optimization.
