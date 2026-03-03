import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 추가: 규칙 커스텀 설정
  {
    rules: {
      // 1. any 사용 허용 (가장 중요한 부분)
      "@typescript-eslint/no-explicit-any": "off",

      // 2. 정의되지 않은 변수 사용 체크 완화 (필요시)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      // 3. <img> 태그 대신 next/image 권장 경고 끄기 (지도 마커 아이콘 때문)
      "@next/next/no-img-element": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
