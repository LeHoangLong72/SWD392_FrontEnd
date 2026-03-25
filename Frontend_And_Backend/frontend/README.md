# React + Vite

## API backend (Azure)

Frontend đang gọi API qua biến môi trường `VITE_API_BASE_URL` trong `src/services/api.js`.

- Development: dùng file `frontend/.env.development`
- Production build: dùng file `frontend/.env.production`

Giá trị hiện tại:

`VITE_API_BASE_URL=https://mywebapiapp20260326011630-bvewb8d4djbebvd6.eastasia-01.azurewebsites.net`

Lưu ý:

- Không thêm `/swagger` vào URL base.
- Nếu chạy frontend local (`http://localhost:5173`), backend cần bật CORS cho origin này.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
