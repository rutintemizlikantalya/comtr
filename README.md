# Rutin Temizlik

Antalya’da Konyaaltı, Muratpaşa ve Kepez ilçelerinde ev, ofis ve apartman temizliği. Statik site. GitHub Pages üzerinde yayınlanır, Cloudflare önünde durabilir.

İnşaat ve şantiye temizliği yoktur. Hatlar haftanın 7 günü açıktır: 0 (533) 097 89 24 ve +90 (505) 068 03 07.

## Yayınlamadan önce

Tüm sitede `https://ALANADINIZ` geçen yerleri kendi adresinizle değiştirin. Alan adı verilmediği için uydurma bir alan adı yazılmadı.

Değişecek dosyalar:

- `index.html`
- `hakkimizda/index.html`
- `hizmetlerimiz/index.html`
- `iletisim/index.html`
- `konyaalti/index.html`
- `muratpasa/index.html`
- `kepez/index.html`
- `robots.txt`
- `sitemap.xml`

Örnek: `https://kullaniciadi.github.io/rutin-temizlik` veya `https://www.sizin-alanadiniz.com`

Sayfa bağlantıları ve `site.webmanifest` yolları görelidir. Proje sitesi (`kullanici.github.io/repo-adi/`) olarak da açılır.

## Klasör

```
index.html                 Ana sayfa
404.html                   Bulunamadı
hakkimizda/index.html      Hakkımızda
hizmetlerimiz/index.html   Hizmetler
iletisim/index.html        İletişim ve form
konyaalti/index.html       Konyaaltı, 39 mahalle
muratpasa/index.html       Muratpaşa, 55 mahalle
kepez/index.html           Kepez, 68 mahalle
css/style.css
js/main.js
assets/logo.png
assets/logo-nav.png
assets/logo-3d.png
assets/favicon.ico
assets/favicon-16x16.png
assets/favicon-32x32.png
assets/apple-touch-icon.png
assets/android-chrome-192x192.png
assets/android-chrome-512x512.png
assets/images/header.jpg
assets/images/          İş fotoğrafları
site.webmanifest
robots.txt
sitemap.xml
_headers                   Cloudflare güvenlik başlıkları
.nojekyll                  GitHub Pages’in Jekyll’i kapatması için
```

`DESIGN.md`, `colurs.txt`, `icons.txt`, `site oluşturma adınmları.txt` ve `Logo/` çalışma notlarıdır. Repoya koyarsanız herkese açık olur. Site bu dosyalar olmadan da çalışır.

Instagram: https://www.instagram.com/rutintemizlikantalya/

Sokak adresi verilmedi. Ekip adrese gelir. Şema’daki koordinat Antalya il merkezidir; dükkân pini değildir. İstemiyorsanız `index.html` içindeki `geo` alanını silin.

## Görseller

Logo, favicon ve fotoğraflar `assets` içindedir. Numaralı dosya adları işe göre değiştirildi. Paylaşım görseli `assets/images/header.jpg`.

| Dosya | Nerede |
| --- | --- |
| `assets/logo-nav.png` | Menüdeki yuvarlak logo |
| `assets/logo.png` | Şema görseli |
| `assets/logo-3d.png` | Hakkımızda |
| `assets/favicon.ico` ve png simgeler | Sekme ikonu |
| `assets/images/header.jpg` | Ana sayfa üst görseli |
| `assets/images/*.jpg` | Hizmet, ilçe ve işten kareler |

Instagram: [@rutintemizlikantalya](https://www.instagram.com/rutintemizlikantalya/)

## GitHub Pages

1. GitHub’da yeni bir **public** depo açın.
2. Bu klasördeki site dosyalarını yükleyin. `index.html` deponun kökünde kalsın.
3. Depoda **Settings → Pages**.
4. **Build and deployment**: Deploy from a branch.
5. Branch: `main`, klasör: `/ (root)`. Save.
6. Birkaç dakika sonra `https://kullaniciadi.github.io/depo-adi/` açılır.
7. Özel alan adı kullanacaksanız Pages ayarına alan adını yazın. GitHub `CNAME` dosyasını kendisi ekler.

`.nojekyll` dosyası durmalı. Yoksa Jekyll alt çizgiyle başlayan dosyaları yutar.

## Cloudflare

DNS ve SSL için:

1. Cloudflare’e alan adını ekleyin. Verilen iki nameserver’ı alan adı firmanıza yazın.
2. DNS kayıtları:
   - `www` için CNAME: `kullaniciadi.github.io` (proxy açık, turuncu bulut).
   - Kök alan adı (`@`) için CNAME: `kullaniciadi.github.io`. Cloudflare kökte CNAME düzleştirmesi yapar. Açılmazsa GitHub’ın A kayıtlarını kullanın: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. **SSL/TLS** şifreleme modu: **Full (strict)**. GitHub sertifikası hazır olmadan strict moda geçmeyin; önce Full, sertifika gelince strict.
4. **Edge Certificates**: Always Use HTTPS açık.
5. GitHub Pages → Custom domain kutusuna alan adını yazın. HTTPS kutusu sertifika hazır olunca işaretlenir.

`_headers` dosyası Cloudflare Pages yayınında uygulanır. Site GitHub Pages’te durup Cloudflare yalnızca DNS/proxy ise bu dosya kendiliğinden devreye girmez. Aynı başlıkları Cloudflare’de **Rules → Transform Rules → Modify Response Header** ile ekleyin:

- `Content-Security-Policy`: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests`
- `X-Frame-Options`: `DENY`
- `X-Content-Type-Options`: `nosniff`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()`
- `Strict-Transport-Security`: `max-age=31536000; includeSubDomains`

## Form

İletişim formu tarayıcıda çalışır. Kayıt bir sunucuya gitmez. Alanlar temizlenir, ardından seçilen WhatsApp hattı açılır. JavaScript kapalıysa sayfadaki doğrudan hatlar kullanılır.

## Yerel önizleme

Klasörde:

```
py -m http.server 8765
```

Tarayıcıda `http://127.0.0.1:8765/` adresini açın.
