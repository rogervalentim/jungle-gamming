import ThankYouImage from '#/assets/thank-you.png'
import { Separator } from '../ui/separator'

export function OrderConfirmation() {
  return (
    <section>
      <div className="">
        <img
          src={ThankYouImage}
          alt="imagem de agradecimento"
          width="80"
          height="80"
        />
        <h2 className="text-base leading-4 text-[#CFB28C] font-bold text-center">
          Seus NFTs agora estão na sua carteira
        </h2>

        <ul>
          <li>
            <span className="text-xs leading-4 font-bold text-[#CFB28C]">
              ID da transação
            </span>
            <span>0xA91F…E82C</span>
          </li>
          <Separator />
          <li></li>
        </ul>
      </div>
    </section>
  )
}
