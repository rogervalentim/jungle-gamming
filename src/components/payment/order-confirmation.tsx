import { Link } from '@tanstack/react-router'
import ThankYouImage from '#/assets/thank-you.png'
import type { Order } from '#/api/orders'

export function OrderConfirmation({ order, wallet }: { order: Order; wallet: string }) {
  return <div className="mx-auto w-full max-w-xl rounded-xl border-b-8 border-[#D28A4C] bg-[#241612] p-8 text-center text-[#F5F1EB]">
    <img src={ThankYouImage} alt="" className="mx-auto mb-4 size-20" />
    <h2 className="mb-4 text-xl font-bold">{order.status === 'confirmed' ? 'Pedido confirmado' : order.status === 'pending' ? 'Pedido pendente' : 'Pagamento recusado'}</h2>
    <p className="mb-5 text-[#CFB28C]">{order.status === 'pending' ? 'Aguardando a resposta da compra simulada. O estado será atualizado automaticamente.' : 'Esta é uma simulação de pedido. Nenhuma transação foi enviada à rede.'}</p>
    <p className="mb-2 text-sm text-[#CFB28C]">Pedido #{order.id.slice(0, 8)}</p>
    <p className="mb-2">Carteira selecionada: <strong>{wallet}</strong></p>
    <p className="mb-4 text-sm text-[#CFB28C]">Referência simulada: SIM-{order.id.slice(0, 8)}</p>
    <ul className="mb-4 text-left text-sm">
      {order.items.map((item) => (
        <li key={`${item.nftId}:${item.editionId}`} className="mb-2 flex justify-between gap-4">
          <span>{item.name} · {item.quantity} × {item.price} ETH</span>
          <span className="break-all">{item.editionId}</span>
        </li>
      ))}
    </ul>
    <dl className="mb-6 text-sm">
      <div className="flex justify-between"><dt>Subtotal</dt><dd>{order.subtotal} ETH</dd></div>
      <div className="flex justify-between"><dt>Desconto</dt><dd>{order.discount} ETH</dd></div>
      <div className="flex justify-between"><dt>Taxa de rede</dt><dd>{order.networkFee} ETH</dd></div>
      <div className="mt-2 flex justify-between font-bold"><dt>Total</dt><dd className="text-[#E89B55]">{order.total} ETH</dd></div>
    </dl>
    <Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#D28A4C] px-6 font-bold text-[#140D0A] hover:brightness-110">Voltar ao início</Link>
  </div>
}
