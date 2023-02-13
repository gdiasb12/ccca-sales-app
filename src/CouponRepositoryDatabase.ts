import Coupon from "./domain/entity/Coupon";
import CouponRepository from "./CouponRepository";

const sqlite3 = require('sqlite3').verbose();

export default class CouponRepositoryDatabase implements CouponRepository {
    async getCoupon(code: string): Promise<Coupon> {
        const connection = new sqlite3.Database('./project.db');
        const sqlCoupon = `SELECT * FROM coupons where code = ?`;
        const couponData: any = await new Promise((resolve, reject) => {
            connection.serialize(() => {
                connection.get(sqlCoupon, [code], (err: any, row: any) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });
        }).then((result: any) => {
            if (!result) throw new Error("Invalid coupon");
            if (result.status == false) throw new Error("Expired coupon"); 
            return result;
        });
        await connection.close();
        return new Coupon(couponData.code, couponData.percentage, couponData.status);
    }
}
