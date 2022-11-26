let story =`'How does that even work?' he muttered as he looked across the 
diner in excitement, 'You're extremely talented roseline'. Mark wasn't the sort of
guy she liked but she was starting to fall for him. He was cheerful and kind. 
'Thank you, Mark'`

console.log(story.replace(/(^|\s)\'|\'(\s|\.|$)/g, matcher))

function matcher(_, first, second) {
    if(first) {
        return `${first}"` 
    } else if (second) {
        return `"${second}`
    } else if (first == undefined || second == undefined) {
        return `"`
    }
}