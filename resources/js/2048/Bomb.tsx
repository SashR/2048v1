

export function Bomb({downscale=false}){


    return (
        <>
            {/* <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512" xml:space="preserve"> */}
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={downscale ? "w-1/4" : ''}>
                <path style={{fill:'#A58868'}} d="M296.764,0c-60.496,0-109.714,49.218-109.714,109.714v24.381h36.571v-24.381
                    c0-40.331,32.812-73.143,73.143-73.143s73.143,32.812,73.143,73.143h36.571C406.478,49.218,357.26,0,296.764,0z"/>
                <rect x="156.574" y="109.714" style={{fill:'#56545A'}} width="97.524" height="85.333"/>
                <circle style={{fill:'#88888F'}} cx="205.336" cy="347.429" r="164.571"/>
                <rect x="369.908" y="158.476" style={{fill:'#FF4F19'}} width="36.571" height="36.571"/>
                <rect x="427.955" y="124.953" transform="matrix(-0.866 -0.5 0.5 -0.866 761.0726 490.4102)" style={{fill:'#FFDB2D'}} width="36.571" height="36.571"/>
                <rect x="427.971" y="57.889" transform="matrix(-0.5 -0.866 0.866 -0.5 603.4218 500.729)" style={{fill:'#FF4F19'}} width="36.571" height="36.571"/>
                <rect x="311.845" y="124.942" transform="matrix(-0.5 -0.866 0.866 -0.5 371.1612 500.7422)" style={{fill:'#FFDB2D'}} width="36.571" height="36.571"/>
                <rect x="205.336" y="109.714" style={{fill:'#272729'}} width="48.762" height="85.333"/>
                <path style={{fill:'#56545A'}} d="M205.335,182.857V512c90.891,0,164.571-73.68,164.571-164.571S296.226,182.857,205.335,182.857z"/>
            </svg>
        </>
    );
}
