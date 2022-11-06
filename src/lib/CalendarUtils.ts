export function dateformat(d:number,fmt:string):string {
    let dt=new Date(d);
    let tokens=fmt.match(/('(\w|\d)+?')|[\/:= .,;-]|(YYYY|MM|WK|DD|WD|HH12|HH24|MI|SS|MLLI|MCRO|NANO|TS|TSMLLI|TSNANO|ISO|TZS|TZH|TZM)/g)
    .map(
        token => {
            let val=getTokenValue(d,token.toString());
            return val;
            // return `[${token.toString()}=${val}]`
        }
    )
    .join("");
    return tokens;
}

function getTokenValue(d:number, token:string){
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