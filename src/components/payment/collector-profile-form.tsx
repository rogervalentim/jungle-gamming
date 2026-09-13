import { Link } from '@tanstack/react-router'
import { useProfile, useWallets } from '#/api/account'

const inputClass =
  'w-full max-w-[369.5px] h-10 rounded-[3px] border border-[#3F2319] bg-transparent px-3 text-sm font-normal text-[#F5F1EB] outline-none'

interface DetailProps {
  label: string
  value: string
  type?: string
}

function Detail({ label, value, type = 'text' }: DetailProps) {
  return (
    <div className="w-full max-w-[369.5px]">
      <label className="flex items-center text-base font-normal text-[#F5F1EB]">
        {label}
        <span className="text-[22px] font-normal text-[#F0805F]">*</span>
      </label>

      <input type={type} className={inputClass} value={value} readOnly />
    </div>
  )
}

export function CollectorProfileForm() {
  const profile = useProfile()
  const wallets = useWallets()

  const primary =
    wallets.data?.items.find((item) => item.primary) ?? wallets.data?.items[0]

  return (
    <div className="w-full max-w-190.75">
      <h1 className="mb-3 text-base leading-4 font-bold text-[#F5F1EB]">
        Perfil do colecionador
      </h1>

      <form className="w-full">
        {/* Nome de exibição / Nome de usuário */}
        <div className="mb-3 flex w-full gap-6">
          <Detail label="Nome de exibição" value={profile.data?.name ?? ''} />

          <Detail
            label="Nome de usuário"
            value={profile.data?.username ?? ''}
          />
        </div>

        {/* Rede / Nome do perfil */}
        <div className="mb-3 flex w-full gap-6">
          <Detail label="Rede" value={primary?.network ?? ''} />

          <Detail label="Nome do perfil" value={profile.data?.name ?? ''} />
        </div>

        {/* Endereço da carteira */}
        <div className="mb-3 w-full">
          <label className="flex items-center text-base font-normal text-[#F5F1EB]">
            Endereço da carteira
            <span className="text-[22px] font-normal text-[#F0805F]">*</span>
          </label>

          <div className="flex w-full gap-6">
            <input
              type="text"
              value={primary?.address ?? ''}
              readOnly
              placeholder="Endereço 0x da carteira"
              className="
                h-10
                w-full
                max-w-[369.5px]
                rounded-[3px]
                border
                border-[#3F2319]
                bg-transparent
                pl-[22.75px]
                text-sm
                text-[#F5F1EB]
                outline-none
                placeholder:text-sm
                placeholder:font-normal
                placeholder:leading-4
                placeholder:text-[#B39463]
              "
            />

            <input
              type="text"
              value={profile.data?.ens ?? ''}
              readOnly
              placeholder="ENS ou carteira secundária (opcional)"
              className="
                h-10
                w-full
                max-w-[369.5px]
                rounded-[3px]
                border
                border-[#3F2319]
                bg-transparent
                pl-[22.75px]
                pr-[34.75px]
                text-sm
                text-[#F5F1EB]
                outline-none
                placeholder:text-sm
                placeholder:font-normal
                placeholder:leading-4
                placeholder:text-[#B39463]
              "
            />
          </div>
        </div>

        {/* Tipo / Apelido da carteira */}
        <div className="mb-3 flex w-full gap-6">
          <Detail label="Tipo de carteira" value={primary?.network ?? ''} />

          <Detail label="Apelido da carteira" value={primary?.label ?? ''} />
        </div>

        {/* Email / ENS */}
        <div className="mb-3 flex w-full gap-6">
          <Detail
            label="E-mail"
            type="email"
            value={profile.data?.email ?? ''}
          />

          <div className="w-full max-w-[369.5px]">
            <label className="flex items-center text-base font-normal text-[#F5F1EB]">
              Nome ENS
              <span className="text-[22px] font-normal text-[#F0805F]">*</span>
            </label>

            <div className="flex items-center">
              <input
                type="text"
                value={profile.data?.ens ?? ''}
                readOnly
                className="
                  h-10
                  w-full
                  rounded-l-[3px]
                  border
                  border-r-0
                  border-[#3F2319]
                  bg-transparent
                  px-3
                  text-sm
                  text-[#F5F1EB]
                  outline-none
                "
              />

              <div
                className="
                  flex
                  h-10
                  w-19.5
                  shrink-0
                  items-center
                  justify-center
                  rounded-r-[3px]
                  border
                  border-[#3F2319]
                  bg-transparent
                  text-sm
                  font-normal
                  text-[#F5F1EB]
                "
              >
                .eth
              </div>
            </div>
          </div>
        </div>

        {/* Usar outra carteira */}
        <div className="mb-3 flex items-center gap-2">
          <input
            type="radio"
            id="other-wallet"
            className="
              h-5
              w-5
              cursor-pointer
              appearance-none
              rounded-full
              border-2
              border-[#D28A4C]
              bg-transparent
              checked:bg-[#D28A4C]
              checked:shadow-[inset_0_0_0_2px_#140D0A]
            "
          />

          <label
            htmlFor="other-wallet"
            className="text-base font-normal text-[#F5F1EB]"
          >
            Usar outra carteira?
          </label>
        </div>

        {/* Observação */}
        <div className="w-full max-w-[369.5px]">
          <label className="mb-3 flex items-center text-base font-normal text-[#F5F1EB]">
            Observação do colecionador (opcional)
          </label>

          <textarea
            readOnly
            className="
              h-38
              w-full
              max-w-[369.5px]
              resize-none
              rounded-[3px]
              border
              border-[#3F2319]
              bg-transparent
              p-3
              text-sm
              text-[#F5F1EB]
              outline-none
            "
          />
        </div>
      </form>

      <p className="mt-4 text-sm text-[#CFB28C]">
        Precisa atualizar seus dados?{' '}
        <Link to="/perfil-do-colecionador" className="text-[#E89B55] underline">
          Editar perfil
        </Link>
        {' · '}
        <Link to="/carteiras" className="text-[#E89B55] underline">
          Gerenciar carteiras
        </Link>
      </p>
    </div>
  )
}
