var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SolarSystem = (function () {
    function SolarSystem() {
        var _this = this;
        $.getJSON('planets.js', function (data) {
            _this.system = data;
        });
    }
    return SolarSystem;
})();
var AsteroMath = (function () {
    function AsteroMath() {
    }
    AsteroMath.r3 = function (x) {
        return math.matrix([
            [Math.cos(x), Math.sin(x), 0],
            [-Math.sin(x), Math.cos(x), 0],
            [0, 0, 1]
        ]);
    };
    AsteroMath.r1 = function (x) {
        return math.matrix([
            [1, 0, 0],
            [0, Math.cos(x), Math.sin(x)],
            [0, -Math.sin(x), Math.cos(x)]
        ]);
    };
    AsteroMath.auToKm = function (dist) {
        return dist * 149579871;
    };
    AsteroMath.kmToAu = function (dist) {
        return dist / 149579871;
    };
    AsteroMath.degToRad = function (angle) {
        return angle / 180 * Math.PI;
    };
    AsteroMath.radToDeg = function (angle) {
        return angle / Math.PI * 180;
    };
    AsteroMath.toCartesian = function (a, ecc, inc, Omega, w, nu, U) {
        var p = a * ((1 - ecc) ^ 2);
        var r_pqw1 = p * Math.cos(nu) / (1 + ecc * Math.cos(nu));
        var r_pqw2 = p * Math.sin(nu) / (1 + ecc * Math.cos(nu));
        var r_pqw3 = 0;
        var r_pqw = math.matrix([r_pqw1, r_pqw2, r_pqw3]);
        var ra = math.multiply(AsteroMath.r3(-Omega), AsteroMath.r1(-inc));
        var rb = math.multiply(ra, AsteroMath.r3(-w));
        var rc = math.multiply(rb, r_pqw);
        return rc;
    };
    AsteroMath.pythagoras = function (m) {
        return Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
    };
    AsteroMath.sphericalToCartesian = function (lat, lon, r) {
        var latRad = AsteroMath.degToRad(lat);
        var lonRad = AsteroMath.degToRad(lon);
        var x = r * Math.cos(latRad) * Math.cos(lonRad);
        var y = r * Math.cos(latRad) * Math.sin(lonRad);
        var z = r * Math.sin(latRad);
        return [x, y, z];
    };
    return AsteroMath;
})();
var AsteroMathTest = (function (_super) {
    __extends(AsteroMathTest, _super);
    function AsteroMathTest() {
        _super.apply(this, arguments);
    }
    AsteroMathTest.prototype.r1Test = function () {
        console.log(AsteroMath.r1(Math.PI / 4));
        /*var expected = math.matrix(
            [
                [1, 0, 0],
                [0, 0.7071, 0.7071],
                [0, -0.7071, 0.7071]
            ]);
        */
    };
    AsteroMathTest.prototype.r3Test = function () {
        console.log(AsteroMath.r3(Math.PI / 4));
        /* var expected = math.matrix(
            [
                [0.7071, 0.7071, 0],
                [-0.7071, 0.7071, 0],
                [0, 0, 1]
            ]);
         */
    };
    AsteroMathTest.prototype.sphericalToCartesianTest = function () {
        var mars = AsteroMath.sphericalToCartesian(48.7687, -0.0240, 1.469496318582);
        var marsDist = AsteroMath.pythagoras(mars);
        var expected = 1.469496318582;
        if (expected !== marsDist) {
            console.error('sphericalToCartesianTest failed!');
            console.error('result: ' + marsDist);
            console.error('expected: ' + expected);
        }
    };
    AsteroMathTest.prototype.run = function () {
        //this.r1Test();
        //this.r3Test();
        this.sphericalToCartesianTest();
    };
    return AsteroMathTest;
})(AsteroMath);
var Renderer = (function () {
    function Renderer() {
        this.createScene = function () {
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            var camera = new BABYLON.OculusCamera("camera1", new BABYLON.Vector3(0, 0, 0), this.scene);
            //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), this.scene);
            camera.setTarget(new BABYLON.Vector3(0, 1, 0));
            camera.attachControl(this.canvas, true);
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 0.7;
            this.system = new SolarSystem();
            return this.scene;
        };
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);
    }
    Renderer.prototype.updateScene = function () {
        var s = this.system.system;
        for (var i = 0; i < s.length; ++i) {
            if (s[i].name) {
                var sphere = BABYLON.Mesh.CreateSphere('p' + i, 4, 0.2, this.scene);
                //var sphere = BABYLON.Mesh.CreatePlane('p1', 0.2, this.scene, false);
                //var spm = new BABYLON.SpriteManager("playerManagr", "star.png", 1, 32, this.scene);
                //var sphere = new BABYLON.Sprite('aa', spm);
                var mat = new BABYLON.StandardMaterial("texture1", this.scene);
                mat.emissiveColor = new BABYLON.Color3(s[i].cr / 255, s[i].cg / 255, s[i].cb / 255);
                //mat.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
                //sphere.lookAt(new BABYLON.Vector3(0, 0, 0), 0, 0, 0);
                sphere.material = mat;
                sphere.position.x = s[i].x;
                sphere.position.y = s[i].y;
                sphere.position.z = s[i].z;
            }
        }
        var material = new BABYLON.StandardMaterial("texture1", this.scene);
        material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        //material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
        var randomCoordinate = function (x) {
            var v = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
            var d = AsteroMath.pythagoras(v);
            var nx = (Math.random() + x) / d;
            return [v[0] * nx, v[1] * nx, v[2] * nx];
        };
        for (var i = 0; i < 100; ++i) {
            var sphere = BABYLON.Mesh.CreateSphere('p' + i, 4, 0.05, this.scene);
            sphere.material = material;
            var c = randomCoordinate(10);
            sphere.position.x = c[0];
            sphere.position.y = c[1];
            sphere.position.z = c[2];
        }
        for (var i = 0; i < 100; ++i) {
            var sphere = BABYLON.Mesh.CreateSphere('p' + i, 4, 0.05, this.scene);
            sphere.material = material;
            var c = randomCoordinate(23);
            sphere.position.x = c[0];
            sphere.position.y = c[1];
            sphere.position.z = c[2];
        }
    };
    Renderer.prototype.start = function () {
        var scene = this.createScene();
        this.engine.runRenderLoop(function () {
            scene.render();
        });
        // Resize
        //window.addEventListener("resize",() => {
        //    this.engine.resize();
        //});
    };
    return Renderer;
})();
window.onload = function () {
    /*
    var r = AsteroMath.toCartesian(
        AsteroMath.auToKm(1.458),
        0.223,
        AsteroMath.degToRad(10.829),
        AsteroMath.degToRad(304.401),
        AsteroMath.degToRad(178.664),
        AsteroMath.degToRad(231.40149),
        132712440018
        )._data;

    var rAu = [AsteroMath.kmToAu(r[0]), AsteroMath.kmToAu(r[1]), AsteroMath.kmToAu(r[2])];
    console.log(rAu);

    console.log(AsteroMath.pythagoras(rAu));
    */
    var mars = AsteroMath.sphericalToCartesian(48.7687, -0.0240, 1.469496318582);
    console.log(mars);
    console.log(AsteroMath.pythagoras(mars));
    var test = new AsteroMathTest();
    test.run();
    var ren = new Renderer();
    ren.start();
    setTimeout(ren.updateScene.bind(ren), 1000);
};
function launchFullscreen(element) {
    var document = window.document;
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }
        else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
//# sourceMappingURL=app.js.map