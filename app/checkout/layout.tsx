import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | Ateliê Sagrado',
  description: 'Finalize sua compra de forma segura',
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
