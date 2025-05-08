export const InputBox=({label,placeholder,onChange})=>{
    return(
        <div className="py-1 bg-clip-padding bg-gradient-to-r from-slate-400 to-gray-600">
            <div className="font-medium text-sm text-left py-2  ">{label}</div>
            <input onChange={onChange} className={`border border-slate-200 bg-slate-200 rounded w-full px-2 py-1`} placeholder={placeholder}></input>
        </div>
    )
}