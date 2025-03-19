import { PageProps } from "@/types";

interface Props {
    text: number|null
}

export default function Welcome({text}: Props) {

    const gradient:any = {2:50,4:100,8:200,16:300,32:400,64:500,128:600,256:700,512:800,1024:900};
    const colors:string = `bg-red-${text ? gradient[text] : ''} text-slate-${text && text>=64 ? '200' : '700'}`;
    const classes = 'w-20 h-20 transition-all ease-in duration-100 font-semibold flex justify-center items-center m-1 rounded-md text-4xl ' + colors;
    return (
    <>
        {
        text ?
        <div className={classes}>
            {text}
        </div> :
        <div className='w-20 h-20 transition-all ease-in duration-100 bg-slate-200 text-slate-200 font-semibold flex justify-center items-center m-1 rounded-md text-5xl'></div>
        }
    </>
    );
}
