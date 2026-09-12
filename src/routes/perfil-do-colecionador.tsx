import { Footer } from '#/components/footer'
import { Navbar } from '#/components/navbar'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import Image from '#/assets/image.png'

export const Route = createFileRoute('/perfil-do-colecionador')({
  component: PerfilDoColecionadorRouteComponent,
})

function PerfilDoColecionadorRouteComponent() {
  return (
    <>
      <Navbar />
      <main className="m-auto w-full max-w-300 pt-8 flex gap-7 mb-24">
        <aside className="max-w-77.5 w-full max-h-101.75 h-auto bg-[#241612] pt-4.5 ">
          <h3 className="text-[18px] font-bold leading-4 text-[#F5F1EB] mb-2.5 pl-3.25 ">
            Meu perfil
          </h3>

          <ul className="border-[#D28A4C] border-b-[0.3px]">
            <li className="pl-3.25 h-11.25 border-l-[6px] border-[#D28A4C]">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 1.15385C4.61038 1.15385 3.48387 2.27313 3.48387 3.65385C3.48387 5.03456 4.61038 6.15385 6 6.15385C7.38962 6.15385 8.51613 5.03456 8.51613 3.65385C8.51613 2.27313 7.38962 1.15385 6 1.15385ZM2.32258 3.65385C2.32258 1.63588 3.96902 0 6 0C8.03098 0 9.67742 1.63588 9.67742 3.65385C9.67742 5.67181 8.03098 7.30769 6 7.30769C3.96902 7.30769 2.32258 5.67181 2.32258 3.65385Z"
                      fill="#D28A4C"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.09963 10C2.47683 10 1.16129 11.3071 1.16129 12.9195C1.16129 13.0042 1.17686 13.0639 1.19319 13.0987C1.20697 13.1281 1.21879 13.1365 1.22865 13.1418C1.67991 13.3858 2.94511 13.8462 6 13.8462C9.05489 13.8462 10.3201 13.3858 10.7713 13.1418C10.7812 13.1365 10.793 13.1281 10.8068 13.0987C10.8231 13.0639 10.8387 13.0042 10.8387 12.9195C10.8387 11.3071 9.52317 10 7.90037 10H4.09963ZM0 12.9195C0 10.6699 1.83547 8.84616 4.09963 8.84616H7.90037C10.1645 8.84616 12 10.6699 12 12.9195C12 13.3325 11.8495 13.8725 11.3264 14.1553C10.6335 14.53 9.14689 15 6 15C2.85311 15 1.36654 14.53 0.673589 14.1553C0.150475 13.8725 0 13.3325 0 12.9195Z"
                      fill="#D28A4C"
                    />
                  </svg>
                </span>
                Dados do perfil
              </a>
            </li>
            <li className="pl-4.75 h-11.25">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.87557 5.41699C6.0714 5.41699 5.41724 6.07116 5.41724 6.87616C5.41724 7.68033 6.0714 8.33366 6.87557 8.33366C7.67974 8.33366 8.3339 7.68033 8.3339 6.87616C8.3339 6.07116 7.67974 5.41699 6.87557 5.41699M6.87557 9.58366C5.38224 9.58366 4.16724 8.36949 4.16724 6.87616C4.16724 5.38199 5.38224 4.16699 6.87557 4.16699C8.3689 4.16699 9.5839 5.38199 9.5839 6.87616C9.5839 8.36949 8.3689 9.58366 6.87557 9.58366"
                      fill="#B39463"
                    />
                    <mask
                      id="mask0_71529_354"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="14"
                      height="17"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 0H13.7496V16.25H0V0Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask0_71529_354)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.87476 1.25C3.77309 1.25 1.24976 3.7975 1.24976 6.9275C1.24976 10.91 5.93642 14.79 6.87476 14.9967C7.81309 14.7892 12.4998 10.9092 12.4998 6.9275C12.4998 3.7975 9.97642 1.25 6.87476 1.25V1.25ZM6.87476 16.25C5.37976 16.25 -0.000244141 11.6233 -0.000244141 6.9275C-0.000244141 3.1075 3.08392 0 6.87476 0C10.6656 0 13.7498 3.1075 13.7498 6.9275C13.7498 11.6233 8.36976 16.25 6.87476 16.25V16.25Z"
                        fill="#B39463"
                      />
                    </g>
                  </svg>
                </span>
                Carteiras
              </a>
            </li>
            <li className="pl-4.75 h-11.25">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8646 15.1849H7.41669C5.0909 15.1849 3.19871 13.2927 3.19871 10.9669V6.64344C3.19871 4.48137 2.12108 2.48011 0.316103 1.29001C-0.00804932 1.07629 -0.0975409 0.640295 0.11617 0.316143C0.329881 -0.00804446 0.765845 -0.0975712 1.09007 0.11621C2.12045 0.795587 2.95638 1.69163 3.55414 2.72328C3.68332 2.86799 4.72495 3.97205 6.43253 3.97205H14.5278C16.7364 3.93075 18.4651 6.14719 17.8877 8.27903L16.9558 11.9933C16.4843 13.8724 14.802 15.1849 12.8646 15.1849ZM4.42734 4.98088C4.54421 5.52082 4.6047 6.07756 4.6047 6.64344V10.9669C4.6047 12.5174 5.86616 13.7789 7.41669 13.7789H12.8646C14.1562 13.7789 15.2777 12.9039 15.592 11.6512L16.5239 7.93688C16.8671 6.67015 15.8397 5.35354 14.5278 5.37804H6.4325C5.66022 5.37804 4.98801 5.21154 4.42734 4.98088ZM7.06519 17.1181C7.06519 16.6328 6.67176 16.2394 6.18645 16.2394C5.02046 16.2858 5.02147 17.9509 6.18645 17.9968C6.67176 17.9968 7.06519 17.6034 7.06519 17.1181ZM14.06 17.1181C14.06 16.6328 13.6666 16.2394 13.1813 16.2394C12.0153 16.2858 12.0163 17.9509 13.1813 17.9968C13.6666 17.9968 14.06 17.6034 14.06 17.1181ZM15.2308 7.48703C15.2308 7.09877 14.9161 6.78404 14.5278 6.78404H6.71369C5.78096 6.82115 5.78166 8.15323 6.71369 8.19003H14.5278C14.9161 8.19003 15.2308 7.8753 15.2308 7.48703Z"
                      fill="#B39463"
                    />
                  </svg>
                </span>
                Atividade
              </a>
            </li>
            <li className="pl-4.75 h-11.25">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 14.2349C7.77222 14.2349 7.55261 14.1523 7.38147 14.0024C6.73511 13.4373 6.11194 12.9061 5.56213 12.4376L5.55933 12.4352C3.94739 11.0615 2.55542 9.87524 1.58691 8.70667C0.504272 7.40027 0 6.16162 0 4.80847C0 3.49377 0.450806 2.28088 1.26929 1.39307C2.09753 0.494751 3.23401 0 4.46973 0C5.39331 0 6.23914 0.291992 6.98364 0.867798C7.35938 1.15845 7.69995 1.51416 8 1.92908C8.30017 1.51416 8.64062 1.15845 9.01648 0.867798C9.76099 0.291992 10.6068 0 11.5304 0C12.766 0 13.9026 0.494751 14.7308 1.39307C15.5493 2.28088 16 3.49377 16 4.80847C16 6.16162 15.4958 7.40027 14.4132 8.70654C13.4447 9.87524 12.0529 11.0614 10.4412 12.4349C9.89038 12.9042 9.26624 13.4362 8.61841 14.0027C8.44739 14.1523 8.22766 14.2349 8 14.2349ZM4.46973 0.937256C3.4989 0.937256 2.60706 1.32471 1.95825 2.02832C1.2998 2.74255 0.937134 3.72986 0.937134 4.80847C0.937134 5.94653 1.36011 6.96436 2.30847 8.10864C3.2251 9.21472 4.5885 10.3766 6.16711 11.7219L6.17004 11.7244C6.72192 12.1947 7.34753 12.7279 7.99866 13.2972C8.65369 12.7268 9.28027 12.1927 9.83325 11.7217C11.4117 10.3763 12.775 9.21472 13.6917 8.10864C14.6399 6.96436 15.0629 5.94653 15.0629 4.80847C15.0629 3.72986 14.7002 2.74255 14.0417 2.02832C13.3931 1.32471 12.5011 0.937256 11.5304 0.937256C10.8192 0.937256 10.1663 1.16333 9.58972 1.60913C9.07593 2.00659 8.71802 2.50903 8.50818 2.8606C8.40027 3.04138 8.21033 3.14929 8 3.14929C7.78967 3.14929 7.59973 3.04138 7.49182 2.8606C7.2821 2.50903 6.92419 2.00659 6.41028 1.60913C5.83374 1.16333 5.18079 0.937256 4.46973 0.937256Z"
                      fill="#B39463"
                    />
                  </svg>
                </span>
                Lista de interesse
              </a>
            </li>

            <li className="pl-4.75 h-11.25 ">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.10059 10.128L6.34534 7.21123L8.90584 9.22123L11.1026 6.38623"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.6632 0.75C14.4597 0.75 15.1047 1.395 15.1047 2.1915C15.1047 2.98725 14.4597 3.633 13.6632 3.633C12.8667 3.633 12.2217 2.98725 12.2217 2.1915C12.2217 1.395 12.8667 0.75 13.6632 0.75Z"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.4795 5.93934C14.5792 6.61059 14.625 7.36659 14.625 8.21484C14.625 13.4183 12.891 15.1523 7.6875 15.1523C2.48475 15.1523 0.75 13.4183 0.75 8.21484C0.75 3.01209 2.48475 1.27734 7.6875 1.27734C8.52 1.27734 9.26325 1.32159 9.92475 1.41759"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Ofertas
              </a>
            </li>
            <li className="pl-4.75 h-11.25 ">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.10059 10.128L6.34534 7.21123L8.90584 9.22123L11.1026 6.38623"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.6632 0.75C14.4597 0.75 15.1047 1.395 15.1047 2.1915C15.1047 2.98725 14.4597 3.633 13.6632 3.633C12.8667 3.633 12.2217 2.98725 12.2217 2.1915C12.2217 1.395 12.8667 0.75 13.6632 0.75Z"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.4795 5.93934C14.5792 6.61059 14.625 7.36659 14.625 8.21484C14.625 13.4183 12.891 15.1523 7.6875 15.1523C2.48475 15.1523 0.75 13.4183 0.75 8.21484C0.75 3.01209 2.48475 1.27734 7.6875 1.27734C8.52 1.27734 9.26325 1.32159 9.92475 1.41759"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Arquivos baixados
              </a>
            </li>
            <li className="pl-4.75 h-11.25">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.875 14.25C3.00418 14.25 1.0925 13.904 0.782644 12.1525C0.472792 10.401 2.45537 7.10806 3.06631 6.02135C5.10943 2.38806 6.49779 0.75 7.875 0.75C9.25221 0.75 10.6406 2.38806 12.6837 6.02135C13.2946 7.10806 15.2772 10.401 14.9674 12.1525C14.6583 13.904 12.7458 14.25 7.875 14.25Z"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.875 4.875V7.79625"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.87187 10.4214H7.87862"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Suporte
              </a>
            </li>
          </ul>

          <div className="pl-4.75 h-11.25">
            <a
              href="#"
              className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]"
            >
              <span>
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.0266 8.55924H6.99243"
                    stroke="#D28A4C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5879 6.12939L17.0279 8.55939L14.5879 10.9894"
                    stroke="#D28A4C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5007 4.81667C12.2257 1.83333 11.1091 0.75 6.6674 0.75C0.749899 0.75 0.749899 2.675 0.749899 8.45833C0.749899 14.2417 0.749899 16.1667 6.6674 16.1667C11.1091 16.1667 12.2257 15.0833 12.5007 12.1"
                    stroke="#D28A4C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Sair
            </a>
          </div>
        </aside>

        <div className="w-full ">
          <h3 className="text-base leading-4 font-bold text-[#F7F3EC] mb-8">
            Perfil do colecionador
          </h3>

          <form className="w-full">
            <div className="flex gap-6 w-full mb-3">
              <div className="w-full max-w-104.25">
                <label
                  htmlFor=""
                  className="text-base  font-normal text-[#F5F1EB] flex  items-center"
                >
                  Nome de exibição
                  <span className="text-[22px]  text-[#F0805F] font-normal">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-full max-w-104.25 h-10 rounded-[3px] border border-[#3F2319]"
                />
              </div>
              <div className="w-full max-w-104.25">
                <label
                  htmlFor=""
                  className="text-base  font-normal text-[#F5F1EB] flex  items-center"
                >
                  Nome de usuário
                  <span className="text-[22px]  text-[#F0805F] font-normal">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-full max-w-104.25 h-10 rounded-[3px] border border-[#3F2319]"
                />
              </div>
            </div>
            <div className="flex gap-6 w-full mb-3">
              <div className="w-full max-w-104.25">
                <label
                  htmlFor=""
                  className="text-base  font-normal text-[#F5F1EB] flex  items-center"
                >
                  Email
                  <span className="text-[22px]  text-[#F0805F] font-normal">
                    *
                  </span>
                </label>
                <div className="w-full max-w-104.25">
                  <input
                    type="email"
                    name=""
                    id=""
                    className="w-full max-w-104.25 h-10 rounded-[3px] border border-[#3F2319]"
                  />
                </div>
              </div>

              <div className="w-full max-w-104.25">
                <label
                  htmlFor=""
                  className="text-base  font-normal text-[#F5F1EB] flex  items-center"
                >
                  Nome ENS
                  <span className="text-[22px]  text-[#F0805F] font-normal">
                    *
                  </span>
                </label>
                <div className="flex w-full gap-2.5 ">
                  <div className="relative w-full max-w-19.5">
                    <select
                      id="network"
                      name="network"
                      defaultValue=""
                      className="
                      appearance-none
                      w-full
                      h-10
                      rounded-[3px]
                      border
                      border-[#3F2319]
                      bg-transparent
                      pl-2.5
                      pr-7
                      text-sm
                      leading-3.75
                      font-normal
                      text-[#F5F1EB]
                      outline-none
                      cursor-pointer
                    "
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#140D0A] text-[#F5F1EB]"
                      >
                        .eth
                      </option>

                      <option
                        value="ethereum"
                        className="bg-[#140D0A] text-[#F5F1EB]"
                      >
                        Ethereum
                      </option>

                      <option
                        value="polygon"
                        className="bg-[#140D0A] text-[#F5F1EB]"
                      >
                        Polygon
                      </option>

                      <option
                        value="solana"
                        className="bg-[#140D0A] text-[#F5F1EB]"
                      >
                        Solana
                      </option>
                    </select>

                    <svg
                      className="
                  pointer-events-none
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  w-3
                  h-3
                  text-[#F5F1EB]
                "
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                  <div className="relative w-full ">
                    <input
                      type="text"
                      name=""
                      id=""
                      className="w-full max-w-104.25 h-10 rounded-[3px] border border-[#3F2319]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mb-8">
              <div className="flex gap-7 max-w-full">
                <div className="w-full max-w-104.25">
                  <label
                    htmlFor=""
                    className="text-base  font-normal text-[#F5F1EB] flex  items-center"
                  >
                    Apelido da carteira
                    <span className="text-[22px]  text-[#F0805F] font-normal">
                      *
                    </span>
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type="text"
                      name=""
                      id=""
                      className="w-full max-w-104.25 pl-[22.75px] h-10 rounded-[3px] border border-[#3F2319]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-base  font-normal text-[#F5F1EB] flex  items-center mb-1"
                  >
                    Avatar
                  </label>
                  <div className="flex gap-6">
                    <Avatar className="bg-[#2F1D15] border border-[#3F2319] flex justify-center items-center w-11 h-11">
                      <AvatarImage src={Image} className="w-[16.65px] h-auto" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className="flex">
                      <Button className="bg-[#D28A4C] max-w-24.5 w-full h-10 rounded-[3px] text-sm font-bold leading-4 text-[#140D0A]">
                        Alterar
                      </Button>

                      <Button className="bg-transparent  max-w-24.5 w-full h-10 rounded-[3px] text-sm font-normal leading-4 text-[#F5F1EB]">
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h4 className="font-medium text-base leading-4 text-[#F5F1EB] mb-6">
              Alterar senha
            </h4>

            <div className="w-full max-w-104.25 mb-6">
              <label
                htmlFor=""
                className="text-base  font-normal text-[#F5F1EB] flex  items-center mb-3"
              >
                Senha atual
              </label>
              <div className="relative w-full max-w-104.25 ">
                <input
                  type="password"
                  name=""
                  id=""
                  className="w-full max-w-104.25 h-10 rounded-[3px] border border-[#3F2319]"
                />
                <svg
                  width="17"
                  height="15"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.46761 9.68026C6.30761 9.68026 6.14761 9.61943 6.02594 9.49693C5.41094 8.88276 5.07178 8.06609 5.07178 7.19776C5.07178 5.39776 6.53511 3.93359 8.33344 3.93359C9.19844 3.93359 10.0384 4.28276 10.6376 4.89193C10.8793 5.13859 10.8768 5.53359 10.6301 5.77526C10.3843 6.01859 9.98928 6.01443 9.74678 5.76943C9.38094 5.39693 8.86594 5.18359 8.33344 5.18359C7.22428 5.18359 6.32178 6.08693 6.32178 7.19776C6.32178 7.73193 6.53094 8.23526 6.90928 8.61359C7.15344 8.85776 7.15344 9.25276 6.91011 9.49693C6.78761 9.61943 6.62761 9.68026 6.46761 9.68026Z"
                    fill="#B39463"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.80647 10.4086C8.51064 10.4086 8.2473 10.1969 8.1923 9.89527C8.13064 9.5561 8.35564 9.23027 8.69564 9.1686C9.5123 9.02027 10.159 8.37194 10.3056 7.55444C10.3673 7.21527 10.6923 6.99194 11.0315 7.05027C11.3715 7.1111 11.5973 7.4361 11.5365 7.7761C11.2973 9.1036 10.2456 10.1569 8.91897 10.3986C8.88147 10.4053 8.84314 10.4086 8.80647 10.4086Z"
                    fill="#B39463"
                  />
                  <mask
                    id="mask0_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="14"
                    height="13"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 0.52002H13.4052V12.2685H0V0.52002Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.87875 12.2685C3.74375 12.2685 3.60792 12.2243 3.49292 12.1351C2.08375 11.0285 0.892917 9.40596 0.05125 7.44429C-0.0170833 7.28596 -0.0170833 7.10763 0.05125 6.95013C0.902083 4.98013 2.10042 3.34929 3.51708 2.23513C6.40542 -0.0507079 10.2504 -0.0582079 13.1679 2.25179C13.4388 2.46596 13.4846 2.85929 13.2704 3.13013C13.0554 3.39929 12.6637 3.44679 12.3921 3.23179C9.92042 1.27513 6.73625 1.28179 4.29125 3.21679C3.09458 4.15846 2.06708 5.53013 1.30875 7.19846C2.05958 8.85679 3.07792 10.2201 4.26542 11.1518C4.53708 11.3651 4.58375 11.7585 4.37042 12.0293C4.24708 12.186 4.06375 12.2685 3.87875 12.2685Z"
                      fill="#B39463"
                    />
                  </g>
                  <mask
                    id="mask1_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="5"
                    y="3"
                    width="12"
                    height="11"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.59766 3.9502H16.6664V13.907H5.59766V3.9502Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask1_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.33318 13.907C7.55235 13.907 6.77568 13.7804 6.02568 13.5312C5.69818 13.422 5.52068 13.0679 5.62985 12.7404C5.73902 12.412 6.09152 12.2379 6.42068 12.3445C7.04318 12.552 7.68652 12.657 8.33318 12.657C11.1898 12.657 13.8007 10.622 15.3582 7.1962C14.9782 6.3637 14.5357 5.60953 14.0407 4.9512C13.8332 4.67537 13.8882 4.28287 14.164 4.07537C14.439 3.86787 14.8315 3.92453"
                      fill="#B39463"
                    />
                  </g>
                  <mask
                    id="mask2_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="1"
                    y="0"
                    width="15"
                    height="15"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.13672 0H15.5313V14.3942H1.13672V0Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask2_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.76151 14.3938C1.60151 14.3938 1.44151 14.333 1.31984 14.2105C1.07568 13.9663 1.07568 13.5713 1.31984 13.3271L14.4648 0.182148C14.709 -0.0620182 15.104 -0.0620182 15.3482 0.182148C15.5923 0.426315 15.5923 0.822148 15.3482 1.06632L2.20318 14.2₁₀₅C2.08₁₅₁ ₁₄.₃₃₃ ₁₉₂₁₅₁ ₁₄.₃₉₃₈ ₁₇₆₁₅₁ ₁₄.₃₉₃₈Z"
                      fill="#B39463"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <div className="w-full max-w-104.25 mb-6">
              <label
                htmlFor=""
                className="text-base  font-normal text-[#F5F1EB] flex  items-center mb-3"
              >
                Nova senha
              </label>
              <div className="relative w-full max-w-104.25 ">
                <input
                  type="password"
                  name=""
                  id=""
                  className="w-full max-w-104.25 h-10 rounded-[3px] border border-[#3F2319]"
                />
                <svg
                  width="17"
                  height="15"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.46761 9.68026C6.30761 9.68026 6.14761 9.61943 6.02594 9.49693C5.41094 8.88276 5.07178 8.06609 5.07178 7.19776C5.07178 5.39776 6.53511 3.93359 8.33344 3.93359C9.19844 3.93359 10.0384 4.28276 10.6376 4.89193C10.8793 5.13859 10.8768 5.53359 10.6301 5.77526C10.3843 6.01859 9.98928 6.01443 9.74678 5.76943C9.38094 5.39693 8.86594 5.18359 8.33344 5.18359C7.22428 5.18359 6.32178 6.08693 6.32178 7.19776C6.32178 7.73193 6.53094 8.23526 6.90928 8.61359C7.15344 8.85776 7.15344 9.25276 6.91011 9.49693C6.78761 9.61943 6.62761 9.68026 6.46761 9.68026Z"
                    fill="#B39463"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.80647 10.4086C8.51064 10.4086 8.2473 10.1969 8.1923 9.89527C8.13064 9.5561 8.35564 9.23027 8.69564 9.1686C9.5123 9.02027 10.159 8.37194 10.3056 7.55444C10.3673 7.21527 10.6923 6.99194 11.0315 7.05027C11.3715 7.1111 11.5973 7.4361 11.5365 7.7761C11.2973 9.1036 10.2456 10.1569 8.91897 10.3986C8.88147 10.4053 8.84314 10.4086 8.80647 10.4086Z"
                    fill="#B39463"
                  />
                  <mask
                    id="mask0_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="14"
                    height="13"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 0.52002H13.4052V12.2685H0V0.52002Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.87875 12.2685C3.74375 12.2685 3.60792 12.2243 3.49292 12.1351C2.08375 11.0285 0.892917 9.40596 0.05125 7.44429C-0.0170833 7.28596 -0.0170833 7.10763 0.05125 6.95013C0.902083 4.98013 2.10042 3.34929 3.51708 2.23513C6.40542 -0.0507079 10.2504 -0.0582079 13.1679 2.25179C13.4388 2.46596 13.4846 2.85929 13.2704 3.13013C13.0554 3.39929 12.6637 3.44679 12.3921 3.23179C9.92042 1.27513 6.73625 1.28179 4.29125 3.21679C3.09458 4.15846 2.06708 5.53013 1.30875 7.19846C2.05958 8.85679 3.07792 10.2201 4.26542 11.1518C4.53708 11.3651 4.58375 11.7585 4.37042 12.0293C4.24708 12.186 4.06375 12.2685 3.87875 12.2685Z"
                      fill="#B39463"
                    />
                  </g>
                  <mask
                    id="mask1_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="5"
                    y="3"
                    width="12"
                    height="11"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.59766 3.9502H16.6664V13.907H5.59766V3.9502Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask1_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.33318 13.907C7.55235 13.907 6.77568 13.7804 6.02568 13.5312C5.69818 13.422 5.52068 13.0679 5.62985 12.7404C5.73902 12.412 6.09152 12.2379 6.42068 12.3445C7.04318 12.552 7.68652 12.657 8.33318 12.657C11.1898 12.657 13.8007 10.622 15.3582 7.1962C14.9782 6.3637 14.5357 5.60953 14.0407 4.9512C13.8332 4.67537 13.8882 4.28287 14.164 4.07537C14.439 3.86787 14.8315 3.92453"
                      fill="#B39463"
                    />
                  </g>
                  <mask
                    id="mask2_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="1"
                    y="0"
                    width="15"
                    height="15"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.13672 0H15.5313V14.3942H1.13672V0Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask2_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.76151 14.3938C1.60151 14.3938 1.44151 14.333 1.31984 14.2105C1.07568 13.9663 1.07568 13.5713 1.31984 13.3271L14.4648 0.182148C14.709 -0.0620182 15.104 -0.0620182 15.3482 0.182148C15.5923 0.426315 15.5923 0.822148 15.3482 1.06632L2.20318 14.2₁₀₅C2.08₁₅₁ ₁₄.₃₃₃ ₁₉₂₁₅₁ ₁₄.₃₉₃₈ ₁₇₆₁₅₁ ₁₄.₃₉₃₈Z"
                      fill="#B39463"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <div className="w-full max-w-104.25 mb-8">
              <label
                htmlFor=""
                className="text-base  font-normal text-[#F5F1EB] flex  items-center mb-3"
              >
                Confirmar nova senha
              </label>
              <div className="relative w-full max-w-104.25 ">
                <input
                  type="password"
                  name=""
                  id=""
                  className="w-full max-w-104.25 h-10 rounded-[3px] border border-[#3F2319]"
                />
                <svg
                  width="17"
                  height="15"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.46761 9.68026C6.30761 9.68026 6.14761 9.61943 6.02594 9.49693C5.41094 8.88276 5.07178 8.06609 5.07178 7.19776C5.07178 5.39776 6.53511 3.93359 8.33344 3.93359C9.19844 3.93359 10.0384 4.28276 10.6376 4.89193C10.8793 5.13859 10.8768 5.53359 10.6301 5.77526C10.3843 6.01859 9.98928 6.01443 9.74678 5.76943C9.38094 5.39693 8.86594 5.18359 8.33344 5.18359C7.22428 5.18359 6.32178 6.08693 6.32178 7.19776C6.32178 7.73193 6.53094 8.23526 6.90928 8.61359C7.15344 8.85776 7.15344 9.25276 6.91011 9.49693C6.78761 9.61943 6.62761 9.68026 6.46761 9.68026Z"
                    fill="#B39463"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.80647 10.4086C8.51064 10.4086 8.2473 10.1969 8.1923 9.89527C8.13064 9.5561 8.35564 9.23027 8.69564 9.1686C9.5123 9.02027 10.159 8.37194 10.3056 7.55444C10.3673 7.21527 10.6923 6.99194 11.0315 7.05027C11.3715 7.1111 11.5973 7.4361 11.5365 7.7761C11.2973 9.1036 10.2456 10.1569 8.91897 10.3986C8.88147 10.4053 8.84314 10.4086 8.80647 10.4086Z"
                    fill="#B39463"
                  />
                  <mask
                    id="mask0_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="14"
                    height="13"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 0.52002H13.4052V12.2685H0V0.52002Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.87875 12.2685C3.74375 12.2685 3.60792 12.2243 3.49292 12.1351C2.08375 11.0285 0.892917 9.40596 0.05125 7.44429C-0.0170833 7.28596 -0.0170833 7.10763 0.05125 6.95013C0.902083 4.98013 2.10042 3.34929 3.51708 2.23513C6.40542 -0.0507079 10.2504 -0.0582079 13.1679 2.25179C13.4388 2.46596 13.4846 2.85929 13.2704 3.13013C13.0554 3.39929 12.6637 3.44679 12.3921 3.23179C9.92042 1.27513 6.73625 1.28179 4.29125 3.21679C3.09458 4.15846 2.06708 5.53013 1.30875 7.19846C2.05958 8.85679 3.07792 10.2201 4.26542 11.1518C4.53708 11.3651 4.58375 11.7585 4.37042 12.0293C4.24708 12.186 4.06375 12.2685 3.87875 12.2685Z"
                      fill="#B39463"
                    />
                  </g>
                  <mask
                    id="mask1_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="5"
                    y="3"
                    width="12"
                    height="11"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.59766 3.9502H16.6664V13.907H5.59766V3.9502Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask1_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.33318 13.907C7.55235 13.907 6.77568 13.7804 6.02568 13.5312C5.69818 13.422 5.52068 13.0679 5.62985 12.7404C5.73902 12.412 6.09152 12.2379 6.42068 12.3445C7.04318 12.552 7.68652 12.657 8.33318 12.657C11.1898 12.657 13.8007 10.622 15.3582 7.1962C14.9782 6.3637 14.5357 5.60953 14.0407 4.9512C13.8332 4.67537 13.8882 4.28287 14.164 4.07537C14.439 3.86787 14.8315 3.92453"
                      fill="#B39463"
                    />
                  </g>
                  <mask
                    id="mask2_71529_771"
                    maskUnits="userSpaceOnUse"
                    x="1"
                    y="0"
                    width="15"
                    height="15"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.13672 0H15.5313V14.3942H1.13672V0Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask2_71529_771)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.76151 14.3938C1.60151 14.3938 1.44151 14.333 1.31984 14.2105C1.07568 13.9663 1.07568 13.5713 1.31984 13.3271L14.4648 0.182148C14.709 -0.0620182 15.104 -0.0620182 15.3482 0.182148C15.5923 0.426315 15.5923 0.822148 15.3482 1.06632L2.20318 14.2₁₀₅C2.08₁₅₁ ₁₄.₃₃₃ ₁₉₂₁₅₁ ₁₄.₃₉₃₈ ₁₇₆₁₅₁ ₁₄.₃₉₃₈Z"
                      fill="#B39463"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <Button className="bg-[#D28A4C] max-w-32.75 w-full h-10 rounded-[3px] text-sm font-bold leading-4 text-[#140D0A]">
              Salvar
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
