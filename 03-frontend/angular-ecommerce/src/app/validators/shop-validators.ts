import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    // whiteSpace  validation
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null
    {
        // check if string contains only whitespace
        if((control.value != null) && (control.value.trim().length === 0))
        {
            // html will check for this 'notOnlyWhiteSpace' error key
            return {'notOnlyWhiteSpace': true};
        }
        return null;
    }
}
