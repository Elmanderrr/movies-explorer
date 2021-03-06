/* */ 
"format cjs";
import { isBlank, isPresent, FunctionWrapper, BaseException } from "angular2/src/facade/lang";
import { ListWrapper, StringMapWrapper } from "angular2/src/facade/collection";
export class AST {
    eval(context, locals) { throw new BaseException("Not supported"); }
    get isAssignable() { return false; }
    assign(context, locals, value) { throw new BaseException("Not supported"); }
    visit(visitor) { return null; }
    toString() { return "AST"; }
}
export class EmptyExpr extends AST {
    eval(context, locals) { return null; }
    visit(visitor) {
        // do nothing
    }
}
export class ImplicitReceiver extends AST {
    eval(context, locals) { return context; }
    visit(visitor) { return visitor.visitImplicitReceiver(this); }
}
/**
 * Multiple expressions separated by a semicolon.
 */
export class Chain extends AST {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
    eval(context, locals) {
        var result;
        for (var i = 0; i < this.expressions.length; i++) {
            var last = this.expressions[i].eval(context, locals);
            if (isPresent(last))
                result = last;
        }
        return result;
    }
    visit(visitor) { return visitor.visitChain(this); }
}
export class Conditional extends AST {
    constructor(condition, trueExp, falseExp) {
        super();
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    eval(context, locals) {
        if (this.condition.eval(context, locals)) {
            return this.trueExp.eval(context, locals);
        }
        else {
            return this.falseExp.eval(context, locals);
        }
    }
    visit(visitor) { return visitor.visitConditional(this); }
}
export class If extends AST {
    constructor(condition, trueExp, falseExp) {
        super();
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    eval(context, locals) {
        if (this.condition.eval(context, locals)) {
            this.trueExp.eval(context, locals);
        }
        else if (isPresent(this.falseExp)) {
            this.falseExp.eval(context, locals);
        }
    }
    visit(visitor) { return visitor.visitIf(this); }
}
export class AccessMember extends AST {
    constructor(receiver, name, getter, setter) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.getter = getter;
        this.setter = setter;
    }
    eval(context, locals) {
        if (this.receiver instanceof ImplicitReceiver && isPresent(locals) &&
            locals.contains(this.name)) {
            return locals.get(this.name);
        }
        else {
            var evaluatedReceiver = this.receiver.eval(context, locals);
            return this.getter(evaluatedReceiver);
        }
    }
    get isAssignable() { return true; }
    assign(context, locals, value) {
        var evaluatedContext = this.receiver.eval(context, locals);
        if (this.receiver instanceof ImplicitReceiver && isPresent(locals) &&
            locals.contains(this.name)) {
            throw new BaseException(`Cannot reassign a variable binding ${this.name}`);
        }
        else {
            return this.setter(evaluatedContext, value);
        }
    }
    visit(visitor) { return visitor.visitAccessMember(this); }
}
export class SafeAccessMember extends AST {
    constructor(receiver, name, getter, setter) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.getter = getter;
        this.setter = setter;
    }
    eval(context, locals) {
        var evaluatedReceiver = this.receiver.eval(context, locals);
        return isBlank(evaluatedReceiver) ? null : this.getter(evaluatedReceiver);
    }
    visit(visitor) { return visitor.visitSafeAccessMember(this); }
}
export class KeyedAccess extends AST {
    constructor(obj, key) {
        super();
        this.obj = obj;
        this.key = key;
    }
    eval(context, locals) {
        var obj = this.obj.eval(context, locals);
        var key = this.key.eval(context, locals);
        return obj[key];
    }
    get isAssignable() { return true; }
    assign(context, locals, value) {
        var obj = this.obj.eval(context, locals);
        var key = this.key.eval(context, locals);
        obj[key] = value;
        return value;
    }
    visit(visitor) { return visitor.visitKeyedAccess(this); }
}
export class BindingPipe extends AST {
    constructor(exp, name, args) {
        super();
        this.exp = exp;
        this.name = name;
        this.args = args;
    }
    visit(visitor) { return visitor.visitPipe(this); }
}
export class LiteralPrimitive extends AST {
    constructor(value) {
        super();
        this.value = value;
    }
    eval(context, locals) { return this.value; }
    visit(visitor) { return visitor.visitLiteralPrimitive(this); }
}
export class LiteralArray extends AST {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
    eval(context, locals) {
        return ListWrapper.map(this.expressions, (e) => e.eval(context, locals));
    }
    visit(visitor) { return visitor.visitLiteralArray(this); }
}
export class LiteralMap extends AST {
    constructor(keys, values) {
        super();
        this.keys = keys;
        this.values = values;
    }
    eval(context, locals) {
        var res = StringMapWrapper.create();
        for (var i = 0; i < this.keys.length; ++i) {
            StringMapWrapper.set(res, this.keys[i], this.values[i].eval(context, locals));
        }
        return res;
    }
    visit(visitor) { return visitor.visitLiteralMap(this); }
}
export class Interpolation extends AST {
    constructor(strings, expressions) {
        super();
        this.strings = strings;
        this.expressions = expressions;
    }
    eval(context, locals) {
        throw new BaseException("evaluating an Interpolation is not supported");
    }
    visit(visitor) { visitor.visitInterpolation(this); }
}
export class Binary extends AST {
    constructor(operation, left, right) {
        super();
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
    eval(context, locals) {
        var left = this.left.eval(context, locals);
        switch (this.operation) {
            case '&&':
                return left && this.right.eval(context, locals);
            case '||':
                return left || this.right.eval(context, locals);
        }
        var right = this.right.eval(context, locals);
        switch (this.operation) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '%':
                return left % right;
            case '==':
                return left == right;
            case '!=':
                return left != right;
            case '===':
                return left === right;
            case '!==':
                return left !== right;
            case '<':
                return left < right;
            case '>':
                return left > right;
            case '<=':
                return left <= right;
            case '>=':
                return left >= right;
            case '^':
                return left ^ right;
            case '&':
                return left & right;
        }
        throw 'Internal error [$operation] not handled';
    }
    visit(visitor) { return visitor.visitBinary(this); }
}
export class PrefixNot extends AST {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    eval(context, locals) { return !this.expression.eval(context, locals); }
    visit(visitor) { return visitor.visitPrefixNot(this); }
}
export class Assignment extends AST {
    constructor(target, value) {
        super();
        this.target = target;
        this.value = value;
    }
    eval(context, locals) {
        return this.target.assign(context, locals, this.value.eval(context, locals));
    }
    visit(visitor) { return visitor.visitAssignment(this); }
}
export class MethodCall extends AST {
    constructor(receiver, name, fn, args) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.fn = fn;
        this.args = args;
    }
    eval(context, locals) {
        var evaluatedArgs = evalList(context, locals, this.args);
        if (this.receiver instanceof ImplicitReceiver && isPresent(locals) &&
            locals.contains(this.name)) {
            var fn = locals.get(this.name);
            return FunctionWrapper.apply(fn, evaluatedArgs);
        }
        else {
            var evaluatedReceiver = this.receiver.eval(context, locals);
            return this.fn(evaluatedReceiver, evaluatedArgs);
        }
    }
    visit(visitor) { return visitor.visitMethodCall(this); }
}
export class SafeMethodCall extends AST {
    constructor(receiver, name, fn, args) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.fn = fn;
        this.args = args;
    }
    eval(context, locals) {
        var evaluatedReceiver = this.receiver.eval(context, locals);
        if (isBlank(evaluatedReceiver))
            return null;
        var evaluatedArgs = evalList(context, locals, this.args);
        return this.fn(evaluatedReceiver, evaluatedArgs);
    }
    visit(visitor) { return visitor.visitSafeMethodCall(this); }
}
export class FunctionCall extends AST {
    constructor(target, args) {
        super();
        this.target = target;
        this.args = args;
    }
    eval(context, locals) {
        var obj = this.target.eval(context, locals);
        if (!(obj instanceof Function)) {
            throw new BaseException(`${obj} is not a function`);
        }
        return FunctionWrapper.apply(obj, evalList(context, locals, this.args));
    }
    visit(visitor) { return visitor.visitFunctionCall(this); }
}
export class ASTWithSource extends AST {
    constructor(ast, source, location) {
        super();
        this.ast = ast;
        this.source = source;
        this.location = location;
    }
    eval(context, locals) { return this.ast.eval(context, locals); }
    get isAssignable() { return this.ast.isAssignable; }
    assign(context, locals, value) { return this.ast.assign(context, locals, value); }
    visit(visitor) { return this.ast.visit(visitor); }
    toString() { return `${this.source} in ${this.location}`; }
}
export class TemplateBinding {
    constructor(key, keyIsVar, name, expression) {
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
    }
}
export class AstTransformer {
    visitImplicitReceiver(ast) { return ast; }
    visitInterpolation(ast) {
        return new Interpolation(ast.strings, this.visitAll(ast.expressions));
    }
    visitLiteralPrimitive(ast) {
        return new LiteralPrimitive(ast.value);
    }
    visitAccessMember(ast) {
        return new AccessMember(ast.receiver.visit(this), ast.name, ast.getter, ast.setter);
    }
    visitSafeAccessMember(ast) {
        return new SafeAccessMember(ast.receiver.visit(this), ast.name, ast.getter, ast.setter);
    }
    visitMethodCall(ast) {
        return new MethodCall(ast.receiver.visit(this), ast.name, ast.fn, this.visitAll(ast.args));
    }
    visitSafeMethodCall(ast) {
        return new SafeMethodCall(ast.receiver.visit(this), ast.name, ast.fn, this.visitAll(ast.args));
    }
    visitFunctionCall(ast) {
        return new FunctionCall(ast.target.visit(this), this.visitAll(ast.args));
    }
    visitLiteralArray(ast) {
        return new LiteralArray(this.visitAll(ast.expressions));
    }
    visitLiteralMap(ast) {
        return new LiteralMap(ast.keys, this.visitAll(ast.values));
    }
    visitBinary(ast) {
        return new Binary(ast.operation, ast.left.visit(this), ast.right.visit(this));
    }
    visitPrefixNot(ast) { return new PrefixNot(ast.expression.visit(this)); }
    visitConditional(ast) {
        return new Conditional(ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    }
    visitPipe(ast) {
        return new BindingPipe(ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    }
    visitKeyedAccess(ast) {
        return new KeyedAccess(ast.obj.visit(this), ast.key.visit(this));
    }
    visitAll(asts) {
        var res = ListWrapper.createFixedSize(asts.length);
        for (var i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    }
    visitChain(ast) { return new Chain(this.visitAll(ast.expressions)); }
    visitAssignment(ast) {
        return new Assignment(ast.target.visit(this), ast.value.visit(this));
    }
    visitIf(ast) {
        let falseExp = isPresent(ast.falseExp) ? ast.falseExp.visit(this) : null;
        return new If(ast.condition.visit(this), ast.trueExp.visit(this), falseExp);
    }
}
var _evalListCache = [
    [],
    [0],
    [0, 0],
    [0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
function evalList(context, locals, exps) {
    var length = exps.length;
    if (length > 10) {
        throw new BaseException("Cannot have more than 10 argument");
    }
    var result = _evalListCache[length];
    for (var i = 0; i < length; i++) {
        result[i] = exps[i].eval(context, locals);
    }
    return result;
}
//# sourceMappingURL=ast.js.map