import { ax } from '../config';
import { IRepository } from "./IRepo";
import Announcement from "../models/Announcement";
import config from "../config";

export interface AnnouncementFilter {
  keyword?: string
}

export class AnnouncementRepository implements IRepository<Announcement> {
  urlPrefix = config.remoteRepositoryUrlPrefix
  
  async getAll(filter: AnnouncementFilter): Promise<Announcement[] | null> {
    const params = {...filter}
    const resp = await ax.get<Announcement[]>(`${this.urlPrefix}/announcement`, { params })
    return resp.data
  }

  async get(id: string|number): Promise<Announcement | null> {
    const resp = await ax.get<Announcement>(`${this.urlPrefix}/announcement/${id}`)
    return resp.data
  }

  async create(entity: Partial<Announcement>): Promise<Announcement | null> {
    const resp = await ax.post<Announcement>(`${this.urlPrefix}/announcement`, entity)
    return resp.data
  }

  async update(entity: Partial<Announcement>): Promise<Announcement | null> {
    const resp = await ax.put<Announcement>(`${this.urlPrefix}/announcement/${entity.id}`, entity)
    return resp.data
  }

  async delete(id: string|number): Promise<void> {
    await ax.delete<void>(`${this.urlPrefix}/announcement/${id}`)
  }

  async read(id: string|number): Promise<Announcement | null> {
    const resp = await ax.get<Announcement>(`${this.urlPrefix}/announcement/${id}/Read`)
    return resp.data
  }

  async MeetingEnd(id: string|number, meetingEnd:boolean): Promise<Announcement | null> {
    const  Value = meetingEnd ? 'meetingEnd/1' : 'meetingEnd/0'
    const resp = await ax.get<Announcement>(`${this.urlPrefix}/announcement/${id}/${Value}`)
    return resp.data
  }
}