export default function Callout({message}: {message: string}) {
  return (
    <div className="bg-yellow-100 border border-yellow-600 rounded-lg p-4 flex flex-row m-4 gap-2">
        <div>
            {warningIcon()}
        </div>
        <div className="italic">
            Note: {message}
        </div>
    </div>
  );
}

function warningIcon(){

    let size = 25

    return (
        <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none" className="stroke-yellow-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15.12 4.623a1 1 0 011.76 0l11.32 20.9A1 1 0 0127.321 27H4.679a1 1 0 01-.88-1.476l11.322-20.9zM16 18v-6"/>
            <path d="M17.5 22.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
        </svg>
    )
}