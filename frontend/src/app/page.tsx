import { redirect } from 'next/navigation'

export default function Home() {
  // 首页重定向到管理后台
  redirect('/admin')
}
