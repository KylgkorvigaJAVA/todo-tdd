const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

const todoId = "69b28c6ef2605f7e7293c274";

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo
    })

    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function')
    })

    it('should call TodoModel.create', () => {
        req.body = newTodo
        TodoController.createTodo(req, res, next)
        expect(TodoModel.create).toHaveBeenCalledWith(newTodo)
    })

    it('should return 201 response code', async () => {
        await TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should return json body in response', async () => {
        TodoModel.create.mockReturnValue(newTodo)
        await TodoController.createTodo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it('should handle errors', async () => {
        const errorMessage = { message: "Done property missing" };
        TodoModel.create.mockRejectedValue(errorMessage)
        await TodoController.createTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})

describe('TodoController.getTodos', () => {

    it('should have a getTodos function', () => {
        /* expect(typeof TodoController.getTodos).toBe('function') */
    });

    it('should call TodoModel.find({})', async () => {
        await TodoController.getTodos(req, res, next)
        expect(TodoModel.find).toHaveBeenCalledWith({})
    })

    it('should return 200 response code', async () => {
        TodoModel.find.mockReturnValue(allTodos)
        await TodoController.getTodos(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodos)
    })

    it('should handle errors in getTodos', async () => {
        const errorMessage = { message: "Done property missing" };
        TodoModel.find.mockRejectedValue(errorMessage)
        await TodoController.getTodos(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})

describe('TodoController.getTodoById', () => {
    it('should have a getTodoById function', () => {
        expect(typeof TodoController.getTodoById).toBe('function')
    })

    it('should call TodoModel.findById with route parameter', async () => {
        req.params.todoId = "69b28c6ef2605f7e7293c274";
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toHaveBeenCalledWith("69b28c6ef2605f7e7293c274")
    })

    it('should return 200 response code and json body', async () => {
        TodoModel.findById.mockReturnValue(newTodo)
        req.params.todoId = "69b28c6ef2605f7e7293c274";
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })

    it('should handle errors in getTodoById', async () => {
        const errorMessage = { message: "Error finding todo" };
        TodoModel.findById.mockRejectedValue(errorMessage)
        req.params.todoId = "69b28c6ef2605f7e7293c274";
        await TodoController.getTodoById(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })

    it('should handle errors', async () => {
        const errorMessage = { message: "error finding todoModel" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectedPromise)
        await TodoController.getTodoById(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })

    it("should return 404 when item does not exist", async () => {
        TodoModel.findById.mockReturnValue(null)
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController.updateTodo', () => {
    it("should have a updateTodo function", () => {
        expect(typeof TodoController.updateTodo).toBe('function')
    })

    it("should update with TodoModel.findByIdAndUpdate", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, { 
            new: true,
            useFindAndModify: false
        });
    })

    it("should return a response with json data and http code 200", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)
        await TodoController.updateTodo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })

    it("should hande errors", async () => {
        const errorMessage = { message: "Error updating todo" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await TodoController.updateTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage)
    })

    it("should handle 404", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null)
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})

describe('TodoController.deleteTodo', () => {
    it('should have a deleteTodo function', () => {
        expect(typeof TodoController.deleteTodo).toBe('function')
    })

    it('should call TodoModel.findByIdAndDelete with route parameter', async () => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next)
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId)
    })

    it('should return 200 response code and deleted todo', async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo)
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })

    it('should handle errors in deleteTodo', async () => {
        const errorMessage = { message: "Error deleting todo" };
        TodoModel.findByIdAndDelete.mockRejectedValue(errorMessage)
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })

    it('should return 404 when item does not exist', async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null)
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})