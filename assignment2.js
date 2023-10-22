import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1],  
            [1, -1, -1], [1, 1, -1],   
            [1, 1, -1], [-1, 1, -1],   
            [-1, 1, -1], [-1, -1, -1],
        
            [-1, -1, -1], [-1, -1, 1],  
            [1, -1, -1], [1, -1, 1],    
            [1, 1, -1], [1, 1, 1],      
            [-1, 1, -1], [-1, 1, 1],   
        
            [-1, -1, 1], [1, -1, 1],    
            [1, -1, 1], [1, 1, 1],     
            [1, 1, 1], [-1, 1, 1],      
            [-1, 1, 1], [-1, -1, 1]    
        );
        this.arrays.color = Array(24).fill(color(1, 1, 1, 1));
        this.indices = false;
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        
        this.arrays.position = Vector3.cast(
            [-1, 1, 1], [-1, -1, 1], [1, -1, 1], 
            [-1, 1, 1], [1, 1, 1], [1, -1, 1],  

            [1, 1, 1], [1, -1, 1], [1, -1, -1],  
            [1, 1, 1], [1, -1, -1], [1, 1, -1],  

            [1, 1, -1], [1, -1, -1], [-1, -1, -1],  
            [1, 1, -1], [-1, 1, -1], [-1, -1, -1],  

            [-1, 1, -1], [-1, -1, -1], [-1, -1, 1],  
            [-1, 1, -1], [-1, -1, 1], [-1, 1, 1],  
                
            [-1, 1, -1], [1, 1, -1], [1, 1, 1],  
            [-1, 1, -1], [1, 1, 1], [-1, 1, 1],  

            [-1, -1, -1], [1, -1, -1], [1, -1, 1],  
            [-1, -1, -1], [1, -1, 1], [-1, -1, 1],  
        );


        this.indices.push(
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
        );

        this.arrays.normal = this.arrays.position;
    }
}


class Base_Scene extends Scene {

    constructor() {
        super();
        this.hover = this.swarm = false;
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'single_strip': new Cube_Single_Strip(),
        };

        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        };
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Assignment2 extends Base_Scene {
 
    constructor() {
        super();
        this.outline = false;
        this.colorArr = [];
        for (let i = 0; i < 8; i++) {
            this.colorArr.push(this.random_color());
        }
    }

    set_colors() {
        this.colorArr = [];
        for (let i = 0; i < 8; i++) {
            this.colorArr.push(this.random_color());
        }
    }

    make_control_panel() {
        this.key_triggered_button("Change Colors", ["c"], this.set_colors);
        this.key_triggered_button("Outline", ["o"], () => {
            this.outline = !this.outline;
        });
        this.key_triggered_button("Sit still", ["m"], () => {
            super.hover = !this.hover;
        });
    }



    draw_box_or_outline(context, program_state, model_transform, func, index) {
       
        const blue = hex_color("#1a9ffa");
        
        if (this.outline) {
            this.shapes.outline.draw(context, program_state, model_transform, this.white, "LINES");
        } else {
            if (index % 2 == 0) {
                this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override({color: this.colorArr ? this.colorArr[index] : blue}));
            } else {
                this.shapes.single_strip.draw(context, program_state, model_transform, this.materials.plastic.override({color: this.colorArr ? this.colorArr[index] : blue}), "TRIANGLE_STRIP");
            }
        }
        model_transform = model_transform.times(Mat4.translation(0, 2 , 0));
        model_transform = model_transform.times(Mat4.scale(1, 0.5, 1));
        model_transform = model_transform.times(Mat4.translation(-1, -2 , 0));
        if (this.hover) {
            model_transform = model_transform.times(Mat4.rotation(func * Math.PI *.05, 0, 0, 1));
        } else {
            model_transform = model_transform.times(Mat4.rotation(1 * Math.PI *.05, 0, 0, 1));
        }
        
        model_transform = model_transform.times(Mat4.translation(1, 2 , 0));
        model_transform = model_transform.times(Mat4.scale(1, 2, 1));
        return model_transform;
    }

    random_color() {
        return color(Math.random(), Math.random(), Math.random(), 1.0)
    }

    display(context, program_state) {
        super.display(context, program_state);

        let model_transform = Mat4.identity();
        let t = this.t = program_state.animation_time / 1000;
        let func = this.func = 0.5 + 0.5 * Math.cos(t * 3 * Math.PI/4);
        model_transform = model_transform.times(Mat4.scale(1, 2, 1));

        for (let i = 0; i < 8; i++) {
            model_transform = this.draw_box_or_outline(context, program_state, model_transform, func, i);
        }
        
    }

    
}