import { useTranslation } from 'react-i18next'

export const TaxiCabStatus = {
  Default: 'default',
  Incorrect: 'incorrect',
  Correct: 'correct',
} as const

export type TaxiCabStatus =
  (typeof TaxiCabStatus)[keyof typeof TaxiCabStatus]

interface TaxiCabProps {
  readonly number: number
  readonly status: TaxiCabStatus
  readonly disabled: boolean
  readonly onSelect: () => void
}

export function TaxiCab({
  number,
  status,
  disabled,
  onSelect,
}: TaxiCabProps) {
  const { t } = useTranslation()

  const statusText =
    status === TaxiCabStatus.Incorrect
      ? t('game.statusIncorrect')
      : status === TaxiCabStatus.Correct
        ? t('game.statusCorrect')
        : ''

  const ariaLabel =
    statusText === ''
      ? t('game.taxiAriaLabel', { number })
      : t('game.taxiAriaLabelWithStatus', { number, status: statusText })

  const className = [
    'taxi-cab',
    status === TaxiCabStatus.Incorrect ? 'taxi-cab--incorrect' : '',
    status === TaxiCabStatus.Correct ? 'taxi-cab--correct' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onSelect}
      aria-label={ariaLabel}
    >
      <svg
        className="taxi-cab__svg"
        viewBox="0 0 160 90"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="18" y="38" width="124" height="34" rx="8" fill="#f5c518" />
        <path
          d="M40 38 L52 18 H108 L120 38 Z"
          fill="#f5c518"
          stroke="#202124"
          strokeWidth="2"
        />
        <rect x="56" y="22" width="22" height="14" rx="2" fill="#9ad0ff" />
        <rect x="82" y="22" width="22" height="14" rx="2" fill="#9ad0ff" />
        <rect x="18" y="48" width="124" height="8" fill="#202124" />
        <circle cx="44" cy="74" r="10" fill="#202124" />
        <circle cx="116" cy="74" r="10" fill="#202124" />
        <circle cx="44" cy="74" r="4" fill="#d0d0d0" />
        <circle cx="116" cy="74" r="4" fill="#d0d0d0" />
        <rect x="70" y="12" width="20" height="6" rx="1" fill="#202124" />
      </svg>
      <span className="taxi-cab__plate" aria-hidden="true">
        {number}
      </span>
      <span className="taxi-cab__status" aria-hidden="true">
        {statusText}
      </span>
    </button>
  )
}
