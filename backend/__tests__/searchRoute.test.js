'use strict';
const server = require('../src/server');
const supertest = require('supertest');
const db = require('../src/db/models/index');
const request = supertest(server.app);

describe('testing search route',()=>{
    beforeAll( async () =>{
        await db.sequelize.sync();
    });
    afterAll( async () =>{
        await db.sequelize.drop();
    });
    it('testing search route',async()=>{
        const response = await request.get('/search').send({
            community_name:'test-commuinty'
        })
        expect(response.status).toEqual(500)
    })
})