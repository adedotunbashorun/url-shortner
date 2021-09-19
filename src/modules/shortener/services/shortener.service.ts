import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMAS } from '@shortener/core/constants';
import * as Crypto from 'crypto';

import { Request } from 'express';

import {
  ShortenUrl,
  ShortenUrlDocument,
} from '@shortener/shortener/schema/shorten-url.schema';

import { Model } from 'mongoose';
import configuration from '@config/configuration';

@Injectable()
export class ShortenerService {
  private readonly cryptoJs: any;
  constructor(
    @InjectModel(SCHEMAS.SHORTEN_URL)
    private readonly shortenerModel: Model<ShortenUrlDocument>,
  ) {
    this.cryptoJs = Crypto;
  }

  /**
   * generate shortend url
   *
   * @param data
   * @returns
   */
  async generateShortenedUrl(data: ShortenUrl): Promise<ShortenUrlDocument> {
    const inputUrl = data.url;
    try {
      // check if url exists in database
      const urlResult = await this.shortenerModel.findOne({ url: inputUrl });
      // if url already exist
      if (urlResult) {
        return urlResult;
      }

      // generate an unique shortened url
      let code = '';
      let shortenedUrl = '';

      while (true) {
        // generate shortened url
        code = this.cryptoJs
          .randomBytes(Math.ceil((5 * 3) / 4))
          .toString('base64')
          .replace(/\+/g, '0')
          .replace(/\//g, '0')
          .slice(0, 5);
        shortenedUrl = `${configuration().api.baseUrl}/${code}`;
        // check if this url is unique
        const url = await this.shortenerModel.findOne({ shortenedUrl });
        if (!url) break;
      }

      // create new url document
      return this.shortenerModel.create({
        url: inputUrl,
        shortenedUrl,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async get(code: string): Promise<ShortenUrlDocument> {
    const shortenedUrl = `${configuration().api.baseUrl}/${code}`;
    return this.shortenerModel.findOne({ shortenedUrl });
  }

  async gotoOriginalUrl(
    req: Request,
    code: string,
  ): Promise<ShortenUrlDocument> {
    try {
      const shortenedUrl = `${configuration().api.baseUrl}/${code}`;
      const url = await this.shortenerModel.findOne({ shortenedUrl });
      if (!url) {
        throw new NotFoundException();
      }
      const analytics = url.analytics ? url.analytics : null;
      const resp: any = { uniqueVisit: [] };
      const uniqueData = {
        ipAddress: req.connection.remoteAddress,
        // mode: req.headers['sec-ch-ua-mobile'], //check if it from mobile or not
        device: [
          {
            name: req.headers['sec-ch-ua-platform'] ? 
              (req.headers['sec-ch-ua-platform'] as string).replace(/[^\w\s]/gi, '') :
               'unknown',
            count: 1,
          },
        ],
        count: 1,
      };

      if (analytics) {
        /**
         * looping through unique visits
         */
        analytics.uniqueVisit.forEach((element: any) => {
          element.count += 1;
          if (element.ipAddress === uniqueData.ipAddress) {
            // check if device exist
            const exist = element.device.find(
              (dev: any) => dev.name === uniqueData.device[0].name,
            );
            if (!exist) {
              element.device.push(uniqueData.device[0]);
            } else {
              // get index of an array
              const index = element.device.findIndex(
                (dev: any) => dev.name === exist.name,
              );
              exist.count += 1;
              element.device[index] = exist;
            }
            resp.uniqueVisit.push(element);
          } else {
            uniqueData.count += 1;
            resp.uniqueVisit.push(uniqueData);
          }
        });
      } else {
        resp.uniqueVisit.push(uniqueData);
      }

      await this.shortenerModel.findByIdAndUpdate(url.id, { analytics: resp });

      return url;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
