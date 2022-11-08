export function dateformat(d:number|Date,fmt:string):string {
    let dt=new Date(d);
    let tokens=fmt.match(/(YYYY|MM|WK|DD|WD|HH12|HH24|MI|SS|MLLI|MCRO|NANO|TS|TSMLLI|TSNANO|ISO|TZS|TZH|TZM)|('(\w|\d)+?')|[\/:= .,;-]/g)
    .map(
        token => {
            let val=getTokenStringValue(d,token.toString());
            return val;
            // return `[${token.toString()}=${val}]`
        }
    )
    .join("");
    return tokens;
}

function getTokenStringValue(d:number|Date, token:string){
    const dt=new Date(d);
    const yearstart=new Date(dt.getFullYear()+"-01-01")
    const yearDayStart=yearstart.getDay();
    const tzo = dt.getTimezoneOffset()
    const day= dt.getDay()
    const week = Math.floor((dt.getTime() - yearstart.getTime()-(yearDayStart-day)*24*3600*1000)/3600/24/1000/7)
    const w = dt.toLocaleString('default', { month: 'long' });
    switch(token.toString()){
        case "YYYY": return dt.getFullYear().toString().padStart(4,"0"); 
        case "MM": return (dt.getMonth()+1).toString().padStart(2,"0");
        case "DD": return (dt.getDate()).toString().padStart(2,"0");
        case "HH12": return (dt.getHours()%12).toString().padStart(2,"0");
        case "HH24": return (dt.getHours()).toString().padStart(2,"0");
        case "MI": return (dt.getMinutes()).toString().padStart(2,"0");
        case "SS": return (dt.getSeconds()).toString().padStart(2,"0");
        case "MLLI": return (dt.getMilliseconds()).toString().padStart(3,"0");
        case "MCRO": return (dt.getMilliseconds()+"000").toString().padStart(6,"0");
        case "NANO": return (dt.getMonth()+"000000").toString().padStart(9,"0");
        case "TS": return (dt.getTime()).toString();
        case "TSMLLI": return (dt.getTime()).toString();
        case "TSNANO": return (dt.getTime()).toString();
        case "ISO": return (dt.toISOString());
        case "TZS": return tzo<0?"-":tzo>0?"+":" ";
        case "WD": return day.toString();
        case "WK": return week.toString().padStart(2,"0");
        case "TZH": return Math.abs(Math.floor(tzo/60)).toString().padStart(2,"0");
        case "TZM": return Math.abs(tzo%60).toString().padStart(2,"0");
        default: return token.replace(/'/gi,"")
    }
}
export function getTokenValue(d:number|Date, token:string){
    const dt=new Date(d);
    const yearstart=new Date(dt.getFullYear()+"-01-01")
    const yearDayStart=yearstart.getDay();
    const tzo = dt.getTimezoneOffset()
    const day= dt.getDay()
    const week = Math.floor((dt.getTime() - yearstart.getTime()-(yearDayStart-day)*24*3600*1000)/3600/24/1000/7)
    const w = dt.toLocaleString('default', { month: 'long' });
    switch(token.toString()){
        case "YYYY": return dt.getFullYear(); 
        case "MM": return (dt.getMonth());
        case "DD": return (dt.getDate());
        case "HH12": return (dt.getHours()%12);
        case "HH24": return (dt.getHours());
        case "MI": return (dt.getMinutes());
        case "SS": return (dt.getSeconds());
        case "MLLI": return (dt.getMilliseconds());
        case "MCRO": return (dt.getMilliseconds()*1000);
        case "NANO": return (dt.getMonth()*1000*1000);
        case "TS": return (dt.getTime());
        case "TSMLLI": return (dt.getTime());
        case "TSNANO": return (dt.getTime());
        // case "ISO": return (dt.toISOString());
        case "TZS": return tzo<0?-1:tzo>0?1:0;
        case "WD": return day;
        case "WK": return week;
        case "TZH": return Math.abs(Math.floor(tzo/60));
        case "TZM": return Math.abs(tzo%60);
        default: throw new Error(`unknown token ${token}`)
    }
}
export function getLocales(potential:Array<string>=null){
    const chars="abcdefghijklmnopqrstuvwxyz".split("")
    potential=potential || chars.reduce((l,f) =>{
        return l.concat(chars.map( s => f+s))
    },[])
    return Intl.DateTimeFormat.supportedLocalesOf(potential, { localeMatcher: 'lookup' })

}
export function interval(n:number,precision:number){
    return {start:Math.floor(n/precision)*precision,point:n,end:Math.ceil(n/precision)*precision}
}
export function slidingTimeInterval(d:number,type:"Y"|"M"|"W"|"D"|"H"|"MI"|"S"){
    switch (type){
        case "Y": return interval(d,365*24*60*60*1000)
        case "M": return interval(d,31*60*60*1000)
        case "W": return interval(d,7*24*60*60*1000)
        case "D": return interval(d,24*60*60*1000)
        case "H": return interval(d,60*60*1000)
        case "MI": return interval(d,60*1000)
        case "S": return interval(d,1000)
    }
}
export function snappingTimeInterval(d:number,type:"Y"|"M"|"W"|"D"|"H"|"MI"|"S"){
    switch (type){
        case "Y": return interval(d,365*24*60*60*1000)
        case "M": return interval(d,31*60*60*1000)
        case "W": return interval(d,7*24*60*60*1000)
        case "D": return interval(d,24*60*60*1000)
        case "H": return interval(d,60*60*1000)
        case "MI": return interval(d,60*1000)
        case "S": return interval(d,1000)
    }
}

export type JsonDate={Y?:number,M?:number,W?:number,D?:number,H?:number,MI?:number,S?:number,mS?:number}
export function dateToJson(dt:Date):JsonDate{
    const yearstart=new Date(dt.getFullYear()+"-01-01")
    const yearDayStart=yearstart.getDay();
    const day= dt.getDay()
    const week = Math.floor((dt.getTime() - yearstart.getTime()-(yearDayStart-day)*24*3600*1000)/3600/24/1000/7)
    return {
        Y:dt.getFullYear(),
        M:dt.getMonth(),
        W:week,
        D:dt.getDate(),
        H:dt.getHours(),
        MI:dt.getMinutes(),
        S:dt.getSeconds(),
        mS:dt.getMilliseconds(),
    }
}
export function jsonToDate(json:JsonDate):Date{
    const {Y,M,W,D,H,MI,S,mS}=json;
    const str=`${Y.toString().padStart(4,"0")}-${M.toString().padStart(2,"0")}-${D.toString().padStart(2,"0")} ${H.toString().padStart(2,"0")}:${MI.toString().padStart(2,"0")}:${S.toString().padStart(2,"0")}.${mS.toString().padStart(3,"0")}`
    
    const d=new Date()
    if(Y !== undefined)d.setFullYear(Y);
    if(M !== undefined)d.setMonth(M);
    if(D !== undefined)d.setDate(D);
    if(H !== undefined)d.setHours(H);
    if(MI !== undefined)d.setMinutes(MI);
    if(S !== undefined)d.setSeconds(S);
    if(mS !== undefined)d.setMilliseconds(mS);
    console.log({json,str,d})
    return d;
}
export function modifyDate(date:Date,json:JsonDate):Date{
    const {Y,M,W,D,H,MI,S,mS}=json;
    return jsonToDate({...dateToJson(date),...json})
}

function test(){
    const dt = new Date()
    const json = dateToJson(dt);
    console.log({test:"CalendarUtils.dateToJson",json})
    const dateY= jsonToDate({...json,Y:2000})
    console.log({test:"CalendarUtils.jsonToDate",dateY})
}
test();