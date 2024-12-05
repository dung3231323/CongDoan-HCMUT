# Frontend của Web công đoàn

### Project Structure:

- `assets`: assets
- `components`: lưu reusable components
- `helpers`: utility functions
- `hooks`: custom hooks
- `layouts`: các layout dùng chung cho tất cả các page (ví dụ như nav bar)
- `pages`: các trang (ví dụ /home, /about thì sẽ có path là src/pages/home/Home.tsx và src/pages/about/About.tsx)
- `services`: các hàm để truy cập backend
- `states`: store, slices được tạo bởi redux (global states)
- `tests`: các file test dưới định dạng <filename>.test.{tsx|jsx|ts|js}

### Hướng dẫn chạy

- `npm run dev`: chạy dev server
- `npm run build`: build ra dist/ (run build sử dụng `npx serve dist`)
- `npm run test`: test
- `npm run fmt`: format sử dụng prettier
- `npm run lint`: check code

### Hướng dẫn code

- Code rõ ràng, tránh sử dụng for loop thuần
- Sử dụng ES6 syntax
- Documentation code
- Testing
- [Conventional commit](https://www.conventionalcommits.org/en/v1.0.0/)
- Lưu ý: lint và format code trước khi commit

### Custom config

- Path alias cho "src/" là "@", vì vậy ta có thể dùng import "@/helpers/..." thay vì "../../helpers" (chỉ dành cho import statement)
