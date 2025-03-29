interface Props {
    value: number|null
}

export function Mine({value}: Props){


    return (
        <>
            <div className="border-2 border-slate-100 flex justify-center items-center" style={{width: '25px', height:'25px'}}>
                {value}
            </div>
        </>
    );
}
