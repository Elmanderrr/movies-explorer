/* */ 
"format cjs";
import { Type, isPresent } from 'angular2/src/facade/lang';
export function hasLifecycleHook(e, type, annotation) {
    if (isPresent(annotation.lifecycle)) {
        return annotation.lifecycle.indexOf(e) !== -1;
    }
    else {
        if (!(type instanceof Type))
            return false;
        return e.name in type.prototype;
    }
}
//# sourceMappingURL=directive_lifecycle_reflector.js.map