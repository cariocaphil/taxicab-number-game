interface TaxiPlateProps {
  readonly number: number
}

export function TaxiPlate({ number }: TaxiPlateProps) {
  return (
    <div
      className="taxi-plate"
      role="img"
      aria-label={`Taxi license plate ${number}`}
    >
      <span className="taxi-plate__label" aria-hidden="true">
        Taxi
      </span>
      <span className="taxi-plate__number" aria-hidden="true">
        {number}
      </span>
    </div>
  )
}
