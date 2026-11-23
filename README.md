# 최윤철 포트폴리오

빌드 도구 없이 동작하는 정적 사이트입니다 (HTML · CSS · JavaScript).

```
index.html      메인 (소개, Selected work, Archive, About, Contact)
project.html    프로젝트 상세 (project.html?id=프로젝트ID)
css/style.css   전체 스타일 (색상·폰트는 맨 위 :root 변수)
js/data.js      프로젝트 데이터
js/app.js       화면 그리기
m/, assets/     이미지·영상
serve.ps1       로컬 미리보기 서버
```

## 로컬에서 보기

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

그다음 브라우저에서 http://localhost:5173 을 엽니다.

## 내용 수정

- **프로젝트 추가·수정**: `js/data.js`의 객체를 고칩니다. 주요 필드:
  `id`, `title`, `tagline`, `cat`(예: `"UX/UI Design"`, `"Poster Design"`), `year`, `role`, `tools`,
  `img`(대표 이미지), `video`, `docs`(상세 페이지에 세로로 이어 붙는 이미지 목록), `overview`, `secs`(섹션별 글), `pub`(공개 여부), `feat`(대표 UX/UI 프로젝트).
- 새 프로젝트는 객체를 만들고 맨 아래 `SEEDS` 배열에 넣으면 됩니다. 이미지는 `m/` 폴더에 넣고 `"./m/파일명.jpg"`로 적습니다.
- **숨기기**: `pub: false`로 바꾸거나 `HIDDEN` 목록에 id를 넣습니다.
- **소개·연락처 문구**: `index.html`에서 직접 고칩니다.

## 배포

어느 정적 호스팅이든 이 폴더를 그대로 올리면 됩니다.

- **Netlify Drop**: https://app.netlify.com/drop 에 폴더를 끌어다 놓기 (가장 간단)
- **GitHub Pages**: 저장소에 올리고 Settings → Pages에서 브랜치 지정
- **Vercel**: 저장소를 연결하고 Framework를 "Other"로 두고 배포

`serve.ps1`과 `.claude` 폴더는 배포하지 않아도 됩니다.
