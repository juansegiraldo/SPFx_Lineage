# OpenText™ Core Application Security — Security Review (Markdown Extraction)

> **Source**: “SPFx Lineage - Hybrid Comprehensive.pdf”  
> **Converted**: 2025-10-24 18:15:24

---

## 1) Metadata

- **Tenant**: Stratesys Technology Solutions  
- **Application**: Training Apps  
- **Release**: SPFx Lineage  
- **Business Criticality**: Low  
- **SDLC Status**: Development  
- **Latest Analysis / Static Analysis Date**: 2025-10-20  
- **Open Source Analysis Date**: 2025-10-20  
- **Dynamic Analysis**: Not performed (“---”)  
- **Security Rating**: *Report shows 36 issues; Status: Passed*

---

## 2) Risk Overview

### 2.1 Risk Totals by Severity (all analysis types)
- **Critical**: Open Source (4), Weak Encryption (4) → **8 total**
- **High**: Open Source (9)
- **Medium**: Open Source (17)
- **Info**: Open Source (2)

### 2.2 OWASP Top 10 Mapping

**OWASP 2017**  
- A3 — Sensitive Data Exposure: **4 (Critical)**  
- A9 — Using Components with Known Vulnerabilities: **4 (Critical), 9 (High), 17 (Medium)**  
- Totals displayed: **8 Critical / 9 High / 17 Medium**

**OWASP 2021**  
- A02 — Cryptographic Failures: **4 (Critical)**

### 2.3 Issue Breakdown by Analysis Type
- **Static**: 4 (Weak Encryption)  
- **Open Source (SCA)**: 32  
- **Dynamic / Monitoring**: 0

---

## 3) Critical Issues

### 3.1 Weak Encryption (CWE-327 → OWASP 2017 A3 / OWASP 2021 A02)
- **Finding**: Calls to `parse_RC4CryptoHeader` / `parse_RC4Header` in `data-lineage-viewer-web-part.js` use weak encryption (RC4/DES-class risk).  
- **Locations (examples)**:
  - `.../ClientSideAssets/data-lineage-viewer-web-part.js:42542` (FunctionPointerCall → `parse_RC4CryptoHeader`)  
  - `.../ClientSideAssets/data-lineage-viewer-web-part.js:42417` (FunctionCall → `parse_RC4Header`)  
  - Additional instances at `:42541`, `:42405`  
- **Recommendation**: Replace with strong cryptography (e.g., AES with appropriate key sizes).
- **Status**: ✅ **FALSO POSITIVO VERIFICADO** - No existe código RC4 en el código fuente del proyecto. Las referencias aparecen únicamente en el bundle compilado y provienen de dependencias de terceros (probablemente del build toolchain de SPFx o librerías como xlsx para compatibilidad con formatos legacy). Ver documentación completa en `docs/FORTIFY_FALSE_POSITIVES.md`.

### 3.2 Open Source (SCA) — Critical CVEs
- **tough-cookie 2.5.0** — **CVE-2023-26136** (Prototype Pollution). *Safe*: 4.1.3.  
- **form-data 4.0.3** — **CVE-2025-7783** (Insufficient randomness → HPP). *Safe*: 4.0.4 (root: bump `cypress`).  
- **execa 1.0.0** — *Advisory ID `debricked-233443`* (Uncontrolled search path element). *Safe*: 2.0.0.  
- **(Slots reserved for “Location IDs 43068050/51 etc.” as per report, no extra detail in PDF)*

---

## 4) High-Severity Open Source Issues

- **postcss 6.0.1** — **CVE-2021-23382** (ReDoS). *Safe*: 7.0.36.  
- **validator 8.2.0** — **CVE-2021-3765** (Inefficient regex). *Safe*: 13.7.0.  
- **semver 7.3.8** — **CVE-2022-25883** (ReDoS). *Safe*: 7.5.2.  
- **xlsx 0.18.5** — **CVE-2024-22363** (ReDoS; upstream maintenance caveat). *Safe*: use SheetJS 0.20.2+ (e.g., 0.20.3).  
- **braces 2.3.2** — **CVE-2024-4068** (Uncontrolled resource consumption). *Safe*: 3.0.3 (root: bump `gulp` and `gulp-cli`).  
- **path-to-regexp 0.1.7** — **CVE-2024-45296** (Bad regex → catastrophic backtracking). *Safe*: 0.1.10.  
- **body-parser 1.20.2** — **CVE-2024-45590** (DoS with URL encoding). *Safe*: 1.20.3.  
- **path-to-regexp 0.1.7** — **CVE-2024-52798** (ReDoS; follow-up to 45296). *Safe*: 0.1.12.

---

## 5) Medium-Severity Open Source Issues

- **yargs-parser 2.4.1** — **CVE-2020-7608** (Prototype pollution). *Safe*: 5.0.1.  
- **node-notifier 6.0.0** — **CVE-2020-7789** (OS command injection on Linux). *Safe*: 8.0.1.  
- **got 9.6.0** — **CVE-2022-33987** (Redirect to UNIX socket). *Safe*: 11.8.5 (or >=12.1.0).  
- **request 2.88.2** — **CVE-2023-28155** (SSRF via cross-protocol redirect; package unmaintained). *Mitigate / replace*.  
- **postcss 7.0.38 / 6.0.1 / 7.0.39** — **CVE-2023-44270** (line-return parsing). *Safe*: 8.4.31.  
- **express 4.18.3 / 4.18.1** — **CVE-2024-29041** (Open redirect via malformed URL). *Safe*: 4.19.2.  
- **micromatch 3.1.10** — **CVE-2024-4067** (ReDoS). *Safe*: 4.0.8 (root: bump `gulp` and `gulp-cli`).  
- **webpack 5.88.2** — **CVE-2024-43788** (DOM clobbering gadget → XSS). *Safe*: 5.94.0.  
- **express 4.18.3 / 4.18.1** — **CVE-2024-43796** (untrusted code execution via `res.redirect`). *Safe*: 4.20.0.  
- **send 0.18.0 / 0.16.2** — **CVE-2024-43799** (untrusted code execution via redirect). *Safe*: 0.19.0.  
- **serve-static 1.15.0** — **CVE-2024-43800** (untrusted code execution via redirect). *Safe*: 1.16.0.  
- **tmp 0.0.33 / 0.2.3** — **CVE-2025-54798** (arbitrary tmp file/dir write via symlink). *Safe*: 0.2.4 (root: bump Angular build deps, Cypress; re-install Karma).

---

## 6) Informational (SCA)

- **cookie 0.5.0** — **CVE-2024-47764** (cookie name/path/domain escaping). *Safe*: 0.7.0.  
- **yargs-parser 2.4.1** — *Advisory `debricked-149739`*. *Safe*: 5.0.0-security.0.

---

## 7) Static Code Locations of Interest

- **SPFx bundle**: `data-lineage-spfx/sharepoint/solution/debug/ClientSideAssets/data-lineage-viewer-web-part.js` (multiple instances around lines **42405**, **42417**, **42541**, **42542**).  
- **Project files** (selection):  
  - `data-lineage-spfx/package.json`, `package-lock.json`  
  - `data-lineage-spfx/src/webparts/dataLineageViewer/...` (components, models, services)  
  - Gulpfile/configs: `config/*.json`, `gulpfile.js`  
  - `sharepoint-path-explanation.html`

---

## 8) Immediate Remediation Plan (Actionable for Engineering)

1. **Cryptography**  
   - Remove RC4/weak crypto usage in client bundle; migrate to AES (CBC/GCM as appropriate).  
   - Validate that any file-password/crypto headers parsed are for legacy *read-only* compatibility; if not required, remove.

2. **Dependency Upgrades**  
   - Prioritise **Critical/High** items; upgrade `tough-cookie`, `form-data`, `execa`, `postcss`, `validator`, `semver`, `xlsx`, `braces`, `path-to-regexp`, `body-parser`.  
   - Follow root upgrade notes (e.g., `gulp`/`gulp-cli`, `cypress`, Angular build chain).  
   - Replace **deprecated**/unmaintained packages (`request`, legacy SheetJS via npm) with maintained forks or vendor tarballs.

3. **Express/Redirect Hardening**  
   - After upgrading `express`, `send`, `serve-static`, audit all `res.location()` / `res.redirect()` calls; implement a canonical allowlist and robust URL validation.

4. **Rebuild & Re-scan**  
   - Run SCA and SAST again; ensure **Open Source (32)** and **Weak Encryption (4)** findings are cleared.  
   - Add pre-commit checks (e.g., `npm audit --omit=dev` + SCA in CI).

5. **Documentation**  
   - Capture exceptions (if any) with sign-off and compensating controls.

---

## 9) Appendix — IDs & Trace Notes

- Static weak-encryption finding IDs: 43068037–43068040.  
- Representative SCA IDs (subset): 43068041–43068072.


---

## 10) Per‑vulnerability details

> These entries mirror the structure in your screenshot (CVE → component, observed version, summary, recommendation, safe version). CVSS is included when present in the report; otherwise left as “—”.

### 10.1 CVE-2024-45590 — body-parser
- **Component**: body-parser  
- **Observed version(s)**: 1.20.2 / 1.20.0  
- **CVSS Base Score**: 7.5  
- **Summary**: DoS when URL‑encoding is enabled. Specially crafted payloads can cause resource exhaustion, resulting in denial of service.  
- **Recommendation**: Upgrade affected packages.  
- **Safe version**: **1.20.3**.  

### 10.2 CVE-2024-45296 — path-to-regexp
- **Component**: path-to-regexp  
- **Observed version(s)**: 0.1.7  
- **CVSS Base Score**: —  
- **Summary**: Catastrophic backtracking due to unsafe regular expressions, potentially enabling ReDoS.  
- **Recommendation**: Upgrade.  
- **Safe version**: **0.1.10** (later advisories suggest **0.1.12** as safest).

### 10.3 CVE-2024-52798 — path-to-regexp
- **Component**: path-to-regexp  
- **Observed version(s)**: 0.1.7  
- **CVSS Base Score**: —  
- **Summary**: Additional ReDoS scenario.  
- **Recommendation**: Upgrade.  
- **Safe version**: **0.1.12**.

### 10.4 CVE-2024-29041 — express
- **Component**: express  
- **Observed version(s)**: 4.18.3 / 4.18.1  
- **CVSS Base Score**: —  
- **Summary**: Open redirect via malformed URL handling; may enable phishing or SSRF chains.  
- **Recommendation**: Upgrade and validate redirects.  
- **Safe version**: **4.19.2** (see also 4.20.0 for related fixes).

### 10.5 CVE-2024-43796 — express
- **Component**: express  
- **Observed version(s)**: 4.18.x  
- **CVSS Base Score**: —  
- **Summary**: Untrusted code execution risks tied to redirect helpers in downstream packages.  
- **Recommendation**: Upgrade to latest v4 and audit redirect flows.  
- **Safe version**: **4.20.0**.

### 10.6 CVE-2024-43799 — send
- **Component**: send  
- **Observed version(s)**: 0.18.0 / 0.16.2  
- **CVSS Base Score**: —  
- **Summary**: Untrusted code execution via redirect edge cases.  
- **Recommendation**: Upgrade.  
- **Safe version**: **0.19.0**.

### 10.7 CVE-2024-43800 — serve-static
- **Component**: serve-static  
- **Observed version(s)**: 1.15.0  
- **CVSS Base Score**: —  
- **Summary**: Untrusted code execution via redirect edge cases mirroring `send`.  
- **Recommendation**: Upgrade.  
- **Safe version**: **1.16.0**.

### 10.8 CVE-2021-23382 — postcss
- **Component**: postcss  
- **Observed version(s)**: 6.0.1  
- **CVSS Base Score**: —  
- **Summary**: Regular expression denial of service (ReDoS).  
- **Recommendation**: Upgrade.  
- **Safe version**: **7.0.36** (or **8.x** per ecosystem guidance).

### 10.9 CVE-2023-44270 — postcss
- **Component**: postcss  
- **Observed version(s)**: 7.0.38 / 6.0.1 / 7.0.39  
- **CVSS Base Score**: —  
- **Summary**: Improper handling of certain line returns enabling parser misbehavior.  
- **Recommendation**: Upgrade.  
- **Safe version**: **8.4.31**.

### 10.10 CVE-2021-3765 — validator
- **Component**: validator  
- **Observed version(s)**: 8.2.0  
- **CVSS Base Score**: —  
- **Summary**: Inefficient regular expressions allow ReDoS.  
- **Recommendation**: Upgrade.  
- **Safe version**: **13.7.0**.

### 10.11 CVE-2022-25883 — semver
- **Component**: semver  
- **Observed version(s)**: 7.3.8  
- **CVSS Base Score**: —  
- **Summary**: ReDoS via crafted version strings.  
- **Recommendation**: Upgrade.  
- **Safe version**: **7.5.2**.

### 10.12 CVE-2024-22363 — xlsx (SheetJS)
- **Component**: xlsx  
- **Observed version(s)**: 0.18.5  
- **CVSS Base Score**: —  
- **Summary**: ReDoS in parsing edge cases.  
- **Recommendation**: Upgrade or replace with maintained fork.  
- **Safe version**: **0.20.2+** (e.g., **0.20.3**).

### 10.13 CVE-2024-4068 — braces
- **Component**: braces  
- **Observed version(s)**: 2.3.2  
- **CVSS Base Score**: —  
- **Summary**: Uncontrolled resource consumption (ReDoS).  
- **Recommendation**: Upgrade (may require bumping gulp/gulp‑cli).  
- **Safe version**: **3.0.3**.

### 10.14 CVE-2020-7608 — yargs-parser
- **Component**: yargs-parser  
- **Observed version(s)**: 2.4.1  
- **CVSS Base Score**: —  
- **Summary**: Prototype pollution via key parsing.  
- **Recommendation**: Upgrade.  
- **Safe version**: **5.0.1** (or security-patched line).

### 10.15 CVE-2020-7789 — node-notifier
- **Component**: node-notifier  
- **Observed version(s)**: 6.0.0  
- **CVSS Base Score**: —  
- **Summary**: OS command injection on certain Linux configurations.  
- **Recommendation**: Upgrade.  
- **Safe version**: **8.0.1**.

### 10.16 CVE-2022-33987 — got
- **Component**: got  
- **Observed version(s)**: 9.6.0  
- **CVSS Base Score**: —  
- **Summary**: Redirect to UNIX socket leading to SSRF‑like scenarios.  
- **Recommendation**: Upgrade.  
- **Safe version**: **11.8.5** (or **≥12.1.0**).

### 10.17 CVE-2023-28155 — request (unmaintained)
- **Component**: request  
- **Observed version(s)**: 2.88.2  
- **CVSS Base Score**: —  
- **Summary**: SSRF via cross‑protocol redirects; package is deprecated and unmaintained.  
- **Recommendation**: Replace with maintained HTTP client.  
- **Safe version**: — (use alternative).

### 10.18 CVE-2024-4067 — micromatch
- **Component**: micromatch  
- **Observed version(s)**: 3.1.10  
- **CVSS Base Score**: —  
- **Summary**: ReDoS risk via crafted patterns.  
- **Recommendation**: Upgrade (may require bumping gulp toolchain).  
- **Safe version**: **4.0.8**.

### 10.19 CVE-2024-43788 — webpack
- **Component**: webpack  
- **Observed version(s)**: 5.88.2  
- **CVSS Base Score**: —  
- **Summary**: DOM‑clobbering gadget that could lead to XSS in certain build outputs.  
- **Recommendation**: Upgrade.  
- **Safe version**: **5.94.0**.

### 10.20 CVE-2025-54798 — tmp
- **Component**: tmp  
- **Observed version(s)**: 0.0.33 / 0.2.3  
- **CVSS Base Score**: —  
- **Summary**: Arbitrary tmp file/dir write via symlink race.  
- **Recommendation**: Upgrade.  
- **Safe version**: **0.2.4**.

### 10.21 CVE-2023-26136 — tough-cookie
- **Component**: tough-cookie  
- **Observed version(s)**: 2.5.0  
- **CVSS Base Score**: —  
- **Summary**: Prototype pollution.  
- **Recommendation**: Upgrade.  
- **Safe version**: **4.1.3**.

### 10.22 <advisory> debricked-233443 — execa
- **Component**: execa  
- **Observed version(s)**: 1.0.0  
- **CVSS Base Score**: —  
- **Summary**: Uncontrolled search path element leading to potential execution of unintended binaries.  
- **Recommendation**: Upgrade.  
- **Safe version**: **2.0.0**.

### 10.23 CVE-2025-7783 — form-data
- **Component**: form-data  
- **Observed version(s)**: 4.0.3  
- **CVSS Base Score**: —  
- **Summary**: Insufficient randomness → request smuggling / HPP in edge cases.  
- **Recommendation**: Upgrade (may arrive transitively via cypress).  
- **Safe version**: **4.0.4**.

### 10.24 CVE-2024-47764 — cookie
- **Component**: cookie  
- **Observed version(s)**: 0.5.0  
- **CVSS Base Score**: —  
- **Summary**: Insufficient escaping of cookie attributes.  
- **Recommendation**: Upgrade.  
- **Safe version**: **0.7.0**.

### 10.25 <advisory> debricked-149739 — yargs-parser
- **Component**: yargs-parser  
- **Observed version(s)**: 2.4.1  
- **CVSS Base Score**: —  
- **Summary**: Advisory for hardening; relates to earlier prototype pollution issues.  
- **Recommendation**: Upgrade.  
- **Safe version**: **5.0.0-security.0** (or later).

---

*Autogenerated on 2025-10-24 18:18:45.*
