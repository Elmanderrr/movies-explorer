/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { RegExpWrapper, StringWrapper, isPresent, BaseException, normalizeBlank } from 'angular2/src/facade/lang';
import { StringMapWrapper, ListWrapper } from 'angular2/src/facade/collection';
import { IMPLEMENTS } from 'angular2/src/facade/lang';
import { escapeRegex } from './url';
// TODO(jeffbcross): implement as interface when ts2dart adds support:
// https://github.com/angular/ts2dart/issues/173
export class Segment {
}
class ContinuationSegment extends Segment {
    generate(params) { return ''; }
}
class StaticSegment extends Segment {
    constructor(string) {
        super();
        this.string = string;
        this.name = '';
        this.regex = escapeRegex(string);
    }
    generate(params) { return this.string; }
}
let DynamicSegment = class {
    constructor(name) {
        this.name = name;
        this.regex = "([^/]+)";
    }
    generate(params) {
        if (!StringMapWrapper.contains(params, this.name)) {
            throw new BaseException(`Route generator for '${this.name}' was not included in parameters passed.`);
        }
        return normalizeBlank(StringMapWrapper.get(params, this.name));
    }
};
DynamicSegment = __decorate([
    IMPLEMENTS(Segment), 
    __metadata('design:paramtypes', [String])
], DynamicSegment);
class StarSegment {
    constructor(name) {
        this.name = name;
        this.regex = "(.+)";
    }
    generate(params) {
        return normalizeBlank(StringMapWrapper.get(params, this.name));
    }
}
var paramMatcher = RegExpWrapper.create("^:([^\/]+)$");
var wildcardMatcher = RegExpWrapper.create("^\\*([^\/]+)$");
function parsePathString(route) {
    // normalize route as not starting with a "/". Recognition will
    // also normalize.
    if (StringWrapper.startsWith(route, "/")) {
        route = StringWrapper.substring(route, 1);
    }
    var segments = splitBySlash(route);
    var results = [];
    var specificity = 0;
    // The "specificity" of a path is used to determine which route is used when multiple routes match
    // a URL.
    // Static segments (like "/foo") are the most specific, followed by dynamic segments (like
    // "/:id"). Star segments
    // add no specificity. Segments at the start of the path are more specific than proceeding ones.
    // The code below uses place values to combine the different types of segments into a single
    // integer that we can
    // sort later. Each static segment is worth hundreds of points of specificity (10000, 9900, ...,
    // 200), and each
    // dynamic segment is worth single points of specificity (100, 99, ... 2).
    if (segments.length > 98) {
        throw new BaseException(`'${route}' has more than the maximum supported number of segments.`);
    }
    var limit = segments.length - 1;
    for (var i = 0; i <= limit; i++) {
        var segment = segments[i], match;
        if (isPresent(match = RegExpWrapper.firstMatch(paramMatcher, segment))) {
            results.push(new DynamicSegment(match[1]));
            specificity += (100 - i);
        }
        else if (isPresent(match = RegExpWrapper.firstMatch(wildcardMatcher, segment))) {
            results.push(new StarSegment(match[1]));
        }
        else if (segment == '...') {
            if (i < limit) {
                // TODO (matsko): setup a proper error here `
                throw new BaseException(`Unexpected "..." before the end of the path for "${route}".`);
            }
            results.push(new ContinuationSegment());
        }
        else if (segment.length > 0) {
            results.push(new StaticSegment(segment));
            specificity += 100 * (100 - i);
        }
    }
    var result = StringMapWrapper.create();
    StringMapWrapper.set(result, 'segments', results);
    StringMapWrapper.set(result, 'specificity', specificity);
    return result;
}
function splitBySlash(url) {
    return url.split('/');
}
// represents something like '/foo/:bar'
export class PathRecognizer {
    constructor(path, handler) {
        this.path = path;
        this.handler = handler;
        this.terminal = true;
        var parsed = parsePathString(path);
        var specificity = parsed['specificity'];
        var segments = parsed['segments'];
        var regexString = '^';
        ListWrapper.forEach(segments, (segment) => {
            if (segment instanceof ContinuationSegment) {
                this.terminal = false;
            }
            else {
                regexString += '/' + segment.regex;
            }
        });
        if (this.terminal) {
            regexString += '$';
        }
        this.regex = RegExpWrapper.create(regexString);
        this.segments = segments;
        this.specificity = specificity;
    }
    parseParams(url) {
        var params = StringMapWrapper.create();
        var urlPart = url;
        for (var i = 0; i < this.segments.length; i++) {
            var segment = this.segments[i];
            if (segment instanceof ContinuationSegment) {
                continue;
            }
            var match = RegExpWrapper.firstMatch(RegExpWrapper.create('/' + segment.regex), urlPart);
            urlPart = StringWrapper.substring(urlPart, match[0].length);
            if (segment.name.length > 0) {
                StringMapWrapper.set(params, segment.name, match[1]);
            }
        }
        return params;
    }
    generate(params) {
        return ListWrapper.join(ListWrapper.map(this.segments, (segment) => segment.generate(params)), '/');
    }
    resolveComponentType() { return this.handler.resolveComponentType(); }
}
//# sourceMappingURL=path_recognizer.js.map