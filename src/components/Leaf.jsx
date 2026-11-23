import Page from './Page.jsx'

/**
 * A folha que roda durante a viragem. Tem frente e verso:
 * em modo duplo, o verso é a página que fica do outro lado.
 */
export default function Leaf({ dir, single, front, back, frontSide, backSide }) {
  return (
    <div className={`leaf leaf--${dir} ${single ? 'leaf--single' : ''}`}>
      <div className="leaf__face leaf__face--front">
        <Page page={front} side={frontSide} />
        <span className="leaf__shade" aria-hidden="true" />
      </div>
      {!single && (
        <div className="leaf__face leaf__face--back">
          <Page page={back} side={backSide} />
          <span className="leaf__shade" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
