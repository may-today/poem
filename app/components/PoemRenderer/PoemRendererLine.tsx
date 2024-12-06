import PoemPaperSortableSlip from '../PoemPaperSortableSlip'

const PoemRendererLine: React.FC<{
  id: string
  items: string[]
  index: number
}> = (props) => {
  return (
    <div className="relative flex justify-start flex-wrap min-h-14 px-2 py-3">
      {props.items.map((id) => (
        <PoemPaperSortableSlip key={id.toString()} id={id.toString()} />
      ))}
    </div>
  )
}

export default PoemRendererLine
