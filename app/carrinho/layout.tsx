import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrinho | Ateliê Sagrado',
  description: 'Seu carrinho de compras',
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
