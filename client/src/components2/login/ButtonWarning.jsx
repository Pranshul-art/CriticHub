import { Link } from "react-router-dom"

export function ButtonWarning({label,target,to}){
    return <div className="flex justify-center bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600 rounded">
        <div>
            {label}
        </div>
        
        <Link className=" underline cursor-pointer pl-1 " to={to}>
            {target}
        </Link>
        
    </div>
}