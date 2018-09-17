import * as faker from 'faker';
import { Member } from '@elizer/shared';
import { format, getDay, getMonth } from 'date-fns';

export function list<T> (method: Function, count = 5)  {
    const holder = [];
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < count; i++) {
        holder.push(method());
    }
    return holder as T[];
} 


export function genMember(): Member {
    const {  address, company, email, name, phone } = faker.helpers.userCard();
    const date = format(faker.date.past());
    return {
        name,
        address: address.street,
        churchNo: faker.random.number(1000),
        id: faker.random.uuid(),
        createdAt: faker.date.past().getMilliseconds(),
        day: getDay(date),
        department: faker.commerce.department(),
        email: faker.internet.email(),
        gender: faker.helpers.randomize(['male', 'female']),
        hash: faker.random.uuid(),
        isStudent: faker.random.boolean(),
        isVisitor: faker.random.boolean(),
        job: faker.commerce.department(),
        level: faker.commerce.productName(),
        month: getMonth(date).toString(),
        organization: company.name,
        school: company.name,
        phoneNo: phone,
        updatedAt: faker.date.past().getMilliseconds(),
        workAddress: company.name
    }
}