/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 1. 핸드폰(외부 IP) 접속 허용 설정 — 컴퓨터 IP가 와이파이마다 바뀌므로
  //    사설 IP 대역 전체를 와일드카드로 허용한다 (개발 서버에만 적용됨)
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
  ],

  // 2. 만약 Turbopack 경로 오류가 계속된다면 아래 설정 추가 (선택 사항)
  // transpilePackages: ['next'],
};

export default nextConfig;
