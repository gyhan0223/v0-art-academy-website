/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 1. 핸드폰(외부 IP) 접속 허용 설정
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
  ],

  // 2. 만약 Turbopack 경로 오류가 계속된다면 아래 설정 추가 (선택 사항)
  // transpilePackages: ['next'],

  // 정시 가이드 경로를 학년도에 맞춰 갱신 — 색인·공유된 옛 주소는 여기서 넘겨준다
  async redirects() {
    return [
      {
        source: "/guide/jungsi-2026",
        destination: "/guide/jungsi-2027",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
