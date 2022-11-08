import { getTokenValue, interval } from "./CalendarUtils";

export type CalendarType = "centurydecade" | "centuryyear" | "yearmonth" | "monthday" | "weekday" | "dayhour" | "hourminute";
export const CalendarTypeValues=["centurydecade" , "centuryyear" , "yearmonth" , "monthday" , "weekday" , "dayhour" , "hourminute"]
export type CalendarIntervalType = "century" | "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second";
export type CalendarIntervalTypeValues = ["century" , "year" , "quarter" , "month" , "week" , "day" , "hour" , "minute" , "second"];
export type Nullable<T> = T | null
export type Nullish<T> = T | null | undefined | false | 0 | ""
export type CalendarLocale = "af"|"am"|"ar"|"az"|"bg"|"bn"|"bs"|"ca"|"cs"|"da"|"de"|"el"|"en"|"es"|"et"|"fa"|"fi"|"fr"|"gu"|"he"|"hi"|"hr"|"hu"|"id"|"it"|"ja"|"kn"|"ko"|"lt"|"lv"|"ml"|"ro"|"mr"|"ms"|"nb"|"nl"|"no"|"pa"|"pl"|"pt"|"ru"|"sr-Latn"|"sk"|"sl"|"sr"|"sv"|"sw"|"ta"|"te"|"th"|"fil"|"tr"|"uk"|"ur"|"uz"|"vi"|"zh"
export const CalendarLocaleValues:CalendarLocale[] = ["af","am","ar","az","bg","bn","bs","ca","cs","da","de","el","en","es","et","fa","fi","fr","gu","he","hi","hr","hu","id","it","ja","kn","ko","lt","lv","ml","ro","mr","ms","nb","nl","no","pa","pl","pt","ru","sr-Latn","sk","sl","sr","sv","sw","ta","te","th","fil","tr","uk","ur","uz","vi","zh"]

