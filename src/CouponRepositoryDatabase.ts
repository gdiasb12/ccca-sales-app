import CouponRepository from "./CouponRepository";

const sqlite3 = require('sqlite3').verbose();

export default class CouponRepositoryDatabase implements CouponRepository
 {
    async getCoupon(code: string): Promise<any> {
        const connection = new sqlite3.Database('./project.db');
        const sqlCoupon = `SELECT * FROM coupons where code = ?`;
        const couponPercentage: number = await new Promise((resolve, reject) => {
            connection.serialize(() => {
                connection.get(sqlCoupon, [code], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });
        }).then((result: any) => {
            if (!result) throw new Error("Invalid coupon");
            if (result.status == false) throw new Error("Expired coupon"); 
            return result.percentage;
        });
        await connection.close();
        return couponPercentage;
    }
}
