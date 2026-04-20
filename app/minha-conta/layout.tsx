import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Minha Conta | Ateliê Sagrado',
  description: 'Gerencie sua conta, pedidos e personalizações',
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
