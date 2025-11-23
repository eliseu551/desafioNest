"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaClientExceptionFilter = class PrismaClientExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = this.getHttpStatus(exception);
        response.status(status).json({
            statusCode: status,
            message: this.getMessage(exception),
            code: exception.code,
        });
    }
    getHttpStatus(exception) {
        switch (exception.code) {
            case 'P2002':
                return common_1.HttpStatus.CONFLICT;
            case 'P2025':
                return common_1.HttpStatus.NOT_FOUND;
            default:
                return common_1.HttpStatus.BAD_REQUEST;
        }
    }
    getMessage(exception) {
        if (exception.code === 'P2002') {
            return 'Registro já existe para o campo único informado.';
        }
        if (exception.code === 'P2025') {
            return 'Registro não encontrado.';
        }
        return exception.message;
    }
};
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter;
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaClientExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map