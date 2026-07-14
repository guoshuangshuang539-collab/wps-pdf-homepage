## 6.3 工具内页 <head> 改造

> 输出形式对齐：[国际站 wps.ai 文档中心拆分文档模板及 head 标识定义 · 三、HTML <head> 逐字段完整定义](https://365.kdocs.cn/l/chqDgcaimXJQ)  
> 研发对接方式：**一套公用模板** + **按工具差异化 JSON 注入**（见本节末 `tool-pages-head.diff.json`）。

### 6.3.1 占位符定义（按工具差异化）

| 占位符 | 含义 | 示例（compress-pdf / en-US） |
| --- | --- | --- |
| `{locale}` | BCP 47 语言标签 | en-US |
| `{og_locale}` | Open Graph locale（下划线） | en_US |
| `{section}` | 一级板块路径 | pdf-tools / 3d-conversion |
| `{sectionLabel}` | 面包屑二级文案 | PDF Tools / 3D Conversion |
| `{toolSlug}` | 工具 slug（全语言共用英文） | compress-pdf |
| `{toolName}` | 工具短名 | Compress PDF |
| `{title}` | title / og:title / twitter:title | Compress PDF Online for Free — Reduce PDF Size \| WPS PDF Tools |
| `{description}` | description / og:description / 部分 schema description | Compress PDF files online for free with WPS... |
| `{h1}` | 与页面可见 H1 一致 | Compress PDF Online for Free |
| `{pageUrl}` | 本页绝对 URL（canonical 自引用） | https://pdf.wps.com/en-US/pdf-tools/compress-pdf/ |
| `{og_image}` | 1200×630 OG/Twitter 图 | https://pdf.wps.com/images/og/compress-pdf-1200x630.png |
| `{og_image_alt}` | 配图 alt | WPS Compress PDF Online — reduce PDF file size for free |
| `{aboutTopic}` | WebPage.about | PDF compression |
| `{howtoName}` | HowTo.name | How to compress a PDF online with WPS |
| `{howtoSteps}` | HowTo.step 数组，`[{name,text},...]` | Upload / Compress / Download |
| `{faqItems}` | FAQ 数组，`[{question,answer},...]` | 与页内 FAQ 一一对应 |

**URL 拼装规则（无需在 JSON 里为每种语言重复写死）：**

```plaintext
{pageUrl} = https://pdf.wps.com/{locale}/{section}/{toolSlug}/
```

### 6.3.2 公用 Head 模板（全工具复用）

```html
<!DOCTYPE html>
<html lang="{locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" href="https://pdf.wps.com/favicon.ico">
  <link rel="apple-touch-icon" href="https://pdf.wps.com/apple-touch-icon.png">

  <title>{title}</title>
  <!-- 每个语言版本，canonical 指向自己（self-referencing canonical） -->
  <link rel="canonical" href="{pageUrl}">

  <meta name="description" content="{description}">
  <meta name="author" content="WPS Office">
  <meta name="publisher" content="WPS Office">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

  <!-- hreflang：同 section+toolSlug 的 30 语言互链；研发按语言列表循环生成 -->
  <link rel="alternate" hreflang="{locale}" href="https://pdf.wps.com/{locale}/{section}/{toolSlug}/">
  <link rel="alternate" hreflang="x-default" href="https://pdf.wps.com/en-US/{section}/{toolSlug}/">
  <!-- 其余语言：hreflang="es-ES" → https://pdf.wps.com/es-ES/{section}/{toolSlug}/ … 共 30 个 -->

  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{pageUrl}">
  <meta property="og:site_name" content="WPS PDF Tools">
  <meta property="og:locale" content="{og_locale}">
  <meta property="og:image" content="{og_image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{og_image_alt}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@WPS_Office">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{og_image}">
  <meta name="twitter:image:alt" content="{og_image_alt}">
</head>
```

### 6.3.3 Structured Data（JSON-LD）模板

| 类型 | script type=application/ld+json |
| --- | --- |
| Organization（全站 SHARED，可全局注入） | {"@context":"https://schema.org","@type":"Organization","name":"WPS Office Corporation","url":"https://pdf.wps.com","logo":"https://pdf.wps.com/img/common/logo-dark.svg","email":"officesupport@wps.com","sameAs":["https://www.wps.com","https://www.facebook.com/WPSOffice","https://twitter.com/WPS_Office","https://www.youtube.com/c/WPSOffice"]} |
| BreadcrumbList | {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://pdf.wps.com/{locale}/"},{"@type":"ListItem","position":2,"name":"{sectionLabel}","item":"https://pdf.wps.com/{locale}/{section}/"},{"@type":"ListItem","position":3,"name":"{toolName}","item":"{pageUrl}"}]} |
| SoftwareApplication | {"@context":"https://schema.org","@type":"SoftwareApplication","name":"{h1}","applicationCategory":"UtilitiesApplication","operatingSystem":"Web, Windows, macOS, Linux, Android, iOS","url":"{pageUrl}","description":"{description}","inLanguage":"{locale}","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"publisher":{"@type":"Organization","name":"WPS Office","url":"https://www.wps.com"}} |
| HowTo | {"@context":"https://schema.org","@type":"HowTo","name":"{howtoName}","description":"{description}","inLanguage":"{locale}","totalTime":"PT1M","tool":{"@type":"HowToTool","name":"{toolName}"},"step":[{"@type":"HowToStep","position":1,"name":"{howtoSteps.0.name}","text":"{howtoSteps.0.text}"},{"@type":"HowToStep","position":2,"name":"{howtoSteps.1.name}","text":"{howtoSteps.1.text}"},{"@type":"HowToStep","position":3,"name":"{howtoSteps.2.name}","text":"{howtoSteps.2.text}"}]} |
| FAQPage | {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"{faqItems.0.question}","acceptedAnswer":{"@type":"Answer","text":"{faqItems.0.answer}"}},{"@type":"Question","name":"{faqItems.1.question}","acceptedAnswer":{"@type":"Answer","text":"{faqItems.1.answer}"}},{"@type":"Question","name":"{faqItems.2.question}","acceptedAnswer":{"@type":"Answer","text":"{faqItems.2.answer}"}}]} |
| WebPage | {"@context":"https://schema.org","@type":"WebPage","@id":"{pageUrl}#webpage","url":"{pageUrl}","name":"{h1}","description":"{description}","inLanguage":"{locale}","isPartOf":{"@type":"WebSite","name":"WPS PDF Tools","url":"https://pdf.wps.com"},"about":{"@type":"Thing","name":"{aboutTopic}"},"primaryImageOfPage":{"@type":"ImageObject","url":"{og_image}"}} |

### 6.3.4 研发注入方式

1. **模板固定**：上表 HTML + JSON-LD 结构全站工具内页共用，禁止按工具分叉多套 head 模板。  
2. **差异进 JSON**：每个工具一条记录，字段见占位符表；交付文件 `tool-pages-head.diff.json`（本期含 16 个 PDF 工具 + 3 个 3D Hub，locale=en-US）。  
3. **渲染规则**：用工具对象替换 `{title}` `{description}` `{pageUrl}` 等占位符；`hreflang` 按 `hreflang_locales` 循环，`x-default` 固定指向 en-US。  
4. **一致性约束**：`{title}`↔og/twitter title；`{description}`↔og/schema；`{pageUrl}`↔canonical/og:url；HowTo/FAQ 与页内可见文案一致；无真实评分时不写 aggregateRating。

### 6.3.5 覆盖清单（与 Sitemap / URL 改造对齐）

| toolId / toolSlug | section | 说明 |
| --- | --- | --- |
| compress-pdf | pdf-tools | 压缩 |
| convert-pdf | pdf-tools | 转换聚合页 |
| split-pdf / merge-pdf / sign-pdf | pdf-tools | 拆分 / 合并 / 签名 |
| pdf-to-word … xml-to-pdf | pdf-tools | 11 个格式转换页 |
| mesh-converter / cad-converter / bim-converter | 3d-conversion | 3D 三场景 Hub |

完整个性化字段见 JSON 的 `tools[]` 数组（直接发给研发即可自动注入）。

**JSON 单条结构示意（compress-pdf）：**

```json
{
  "toolId": "compress-pdf",
  "locale": "en-US",
  "og_locale": "en_US",
  "section": "pdf-tools",
  "sectionLabel": "PDF Tools",
  "toolSlug": "compress-pdf",
  "toolName": "Compress PDF",
  "h1": "Compress PDF Online for Free",
  "title": "Compress PDF Online for Free — Reduce PDF Size | WPS PDF Tools",
  "description": "Compress PDF files online for free with WPS...",
  "pageUrl": "https://pdf.wps.com/en-US/pdf-tools/compress-pdf/",
  "og_image": "https://pdf.wps.com/images/og/compress-pdf-1200x630.png",
  "og_image_alt": "WPS Compress PDF Online — reduce PDF file size for free",
  "aboutTopic": "PDF compression",
  "howtoName": "How to compress a PDF online with WPS",
  "howtoSteps": [
    { "name": "Upload", "text": "..." },
    { "name": "Compress", "text": "..." },
    { "name": "Download", "text": "..." }
  ],
  "faqItems": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}
```
