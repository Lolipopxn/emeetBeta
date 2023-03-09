export default interface Announcement{
    id: number
    topic: string
    date: string
    detail: string
    place: string
    agendaRule: string
    pubDateTime: Date
    lastUpdated: Date
    end: boolean
}