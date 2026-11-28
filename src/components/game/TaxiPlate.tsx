import { useTranslation } from 'react-i18next'

interface TaxiPlateProps {
  readonly number: number
}

export function TaxiPlate({ number }: TaxiPlateProps) {
  const { t } = useTranslation()

  return (
    <div
      className="taxi-plate"
      role="img"
      aria-label={t('progressiveReveal.plateAriaLabel', { number })}
    >
      <span className="taxi-plate__label" aria-hidden="true">
        {t('progressiveReveal.plateLabel')}
      </span>
      <span className="taxi-plate__number" aria-hidden="true">
        {number}
      </span>
    </div>
  )
}
